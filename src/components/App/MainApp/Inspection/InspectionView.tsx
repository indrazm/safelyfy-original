"use client"

import * as React from "react"
import { Button } from "@/components/shared/ui/button"
import { Input, TextArea, FileDropZone, Selectable } from "@/components/shared/ui/input"
import { useSetRecoilState } from "recoil"
import { inspectionDataProps } from "@/lib/recoil/inspection"
import { invoiceDataProps } from "@/lib/recoil/invoice"
import OutsideClickHandler from "react-outside-click-handler"
import { listingFiles, handleUploadFiles } from "@/lib/supabase/storage"
import { FileText, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { FileWithPath } from "react-dropzone"
import { toast } from "react-hot-toast"
import FileSaver from "file-saver"
import { loadingState } from "@/lib/recoil/globals"
import { useQRCode } from "next-qrcode"
import { apiUrlClient } from "@/lib/constant/apiUrl"

interface InvoiceDataPropsExtended extends Omit<invoiceDataProps, "currency"> {
    currency: {
        currency: string
    }
}

interface InspectionViewProps {
    statusData: any
    usersData: any
    inspectionData: InspectionData
    invoiceData: InvoiceDataPropsExtended
    invoicesData: any
}

interface InspectionData extends Omit<inspectionDataProps, "inspector"> {
    inspector: {
        id: string
        full_name: string
        avatar: string
    }
    invoiceNumber: {
        id: string
        invoiceNumber: string
    }
}

export const InspectionView = ({ statusData, usersData, inspectionData, invoiceData, invoicesData }: InspectionViewProps) => {
    const [inspectionDataTemp, setInspectionDataTemp] = React.useState(inspectionData)
    const [selectedInspector, setSelectedInspector] = React.useState({
        id: inspectionData.inspector.id,
        label: inspectionData.inspector.full_name,
    })
    const [selectedStatus, setSelectedStatus] = React.useState({
        id: inspectionData.status?.id,
        label: inspectionData.status?.name,
    })
    const [selectedInvoice, setSelectedInvoice] = React.useState({
        id: inspectionData.invoiceNumber.id,
        label: inspectionData.invoiceNumber.invoiceNumber,
    })
    const router = useRouter()
    const params = useParams()
    const { Canvas } = useQRCode()
    const { inspectionId } = params
    const setLoading = useSetRecoilState(loadingState)
    const [thingQrOpen, setThingQrOpen] = React.useState(false)

    const [invoiceInformationOpen, setInvoiceInformationOpen] = React.useState(false)
    const [documents, setDocuments] = React.useState<any>([])
    const [documents1, setDocuments1] = React.useState<FileWithPath[]>([])
    const [qrurl, setQrUrl] = React.useState<any>([])

    const handleLoadFiles = async () => {
        const { data } = await listingFiles({ bucket: "inspections", folderId: inspectionData.id as string })
        if (data && data?.length > 0) {
            const urlqr = supabase.storage.from("inspections").getPublicUrl(`${inspectionId}/${data[0].name}`)
            setQrUrl(urlqr.data.publicUrl)
            setThingQrOpen(true)
        }
        setDocuments(data)
    }

    const handleDownloadFile = async (file: File) => {
        const { inspectionId } = params
        const data = await supabase.storage.from("inspections").download(`${inspectionId}/${file.name}`)
        FileSaver.saveAs(data.data as Blob)
    }

    const handleFiles = (files: FileWithPath[]) => {
        const filesArray = [...documents1]
        files.forEach((file) => {
            filesArray.push(file)
        })
        setDocuments1(filesArray)
        // console.log(files)
    }

    const handleDeleteObjectInArrayByIndex = (index: number) => {
        const filesArray = [...documents1]
        filesArray.splice(index, 1)
        setDocuments1(filesArray)
    }

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setInspectionDataTemp({ ...inspectionDataTemp, [id]: value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        updateInspection()
    }

    const updateInspection = async () => {
        const {
            id,
            inspectionNumber,
            inspectionDate,
            expiryDate,
            timesheet,
            findings,
            operator,
            certificateNumber,
            certificateReceiver,
            invoiceNumber,
            inspector,
            status,
        } = inspectionDataTemp

        console.log(invoiceNumber)

        if (!inspectionNumber || !inspectionDate || !expiryDate || !timesheet || !findings || !invoiceNumber || !inspector) {
            toast.error("Please fill all fields")
            setLoading(false)
            return
        }

        const res = await fetch(`${apiUrlClient}/v1/inspections`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                inspectionDate,
                inspectionNumber,
                expiryDate,
                findings,
                operator,
                certificateNumber,
                certificateReceiver,
                timesheet,
                invoiceNumber: invoiceNumber?.id,
                inspector: inspector?.id,
                status: status?.value,
            }),
        })

        const data = await res.json()

        if (data.data) {
            handleUploadFiles({ bucket: "inspections", files: documents1, folderId: inspectionDataTemp.id as string })
            toast.success("Inspection data successfully uploaded.")

            setLoading(false)
            router.back()
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    React.useEffect(() => {
        handleLoadFiles()
    }, [inspectionData])

    return (
        <>
            {invoiceInformationOpen && (
                <>
                    <OutsideClickHandler onOutsideClick={() => setInvoiceInformationOpen(false)}>
                        <InvoiceDetails invoiceData={invoiceData} />
                    </OutsideClickHandler>
                    <div className="fixed inset-0 z-40 bg-black/40"></div>
                </>
            )}
            <main className="space-y-12">
                <section className="space-y-3">
                    <h1>View Inspection</h1>
                    <div className="flex justify-between items-center">
                        <div>
                            <p>You are currently view inspection</p>
                        </div>
                        <div>
                            <Button size="small" variant="secondary" onClick={() => router.back()}>
                                Back
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Main Information Section */}
                <section className="flex gap-4 border-b-1 pb-12">
                    <div className="w-[320px] space-y-1">
                        <h2>Inspection Information</h2>
                        <p>Detailed Information of the Inspection</p>
                    </div>
                    <div className="w-[calc(100%-320px)]">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="date"
                                    label="Inspection date"
                                    onChange={(e) => setInspectionDataTemp({ ...inspectionDataTemp, inspectionDate: new Date(e.target.value) })}
                                    defaultValue={inspectionDataTemp.inspectionDate?.toString()}
                                />
                                <Input
                                    type="date"
                                    label="Expiry date"
                                    onChange={(e) => setInspectionDataTemp({ ...inspectionDataTemp, expiryDate: new Date(e.target.value) })}
                                    defaultValue={inspectionDataTemp.expiryDate?.toString()}
                                />
                            </div>
                            <Selectable
                                label="Inspector"
                                value={selectedInspector}
                                options={usersData}
                                onChange={(e) => {
                                    setSelectedInspector(e)
                                    setInspectionDataTemp({ ...inspectionDataTemp, inspector: e })
                                }}
                            />
                            <Selectable
                                label="Status"
                                value={selectedStatus}
                                options={statusData}
                                onChange={(e) => {
                                    setSelectedStatus(e)
                                    setInspectionDataTemp({ ...inspectionDataTemp, status: e })
                                }}
                            />{" "}
                        </div>
                    </div>
                </section>

                {/* Timesheet and Invoice */}
                <section className="flex gap-4 border-b-1 pb-12">
                    <div className="w-[320px] space-y-1">
                        <h2>Timesheet and Invoice</h2>
                        <p>Invoice number</p>
                    </div>
                    <div className="w-[calc(100%-320px)] space-y-4">
                        <Input label="Timesheet" defaultValue={inspectionDataTemp.timesheet} />
                        <Selectable
                            label="Invoice"
                            value={selectedInvoice}
                            options={invoicesData}
                            onChange={(e) => {
                                setSelectedInvoice(e)
                                setInspectionDataTemp({ ...inspectionDataTemp, invoice: e })
                            }}
                        />{" "}
                        <Button size="small" variant="secondary" auto onClick={() => setInvoiceInformationOpen(true)}>
                            View Invoice Detail
                        </Button>
                    </div>
                </section>

                {/* Review result */}
                <section className="flex gap-4 border-b-1 pb-12">
                    <div className="w-[320px] space-y-1">
                        <h2>Review results</h2>
                        <p>Detailed relust of the Inspection</p>
                    </div>
                    <div className="w-[calc(100%-320px)] space-y-4">
                        <div className="space-y-4">
                            <TextArea label="Findings" id="findings" placeholder="2000" value={inspectionDataTemp.findings} onChange={handleEventChange} />
                            <Input label="Operator" id="operator" placeholder="Operator" value={inspectionDataTemp.operator} onChange={handleEventChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Certificate number" value={inspectionDataTemp.certificateNumber} onChange={handleEventChange} />
                                <Input label="Certificate receiver" value={inspectionDataTemp.certificateReceiver} onChange={handleEventChange} />
                            </div>
                            <div>Files</div>
                            <div>
                                {thingQrOpen && (
                                    <>
                                        <Canvas
                                            text={qrurl}
                                            options={{
                                                errorCorrectionLevel: "M",
                                                margin: 3,
                                                scale: 4,
                                                width: 200,
                                                color: {
                                                    dark: "#000000",
                                                    light: "#ffffff",
                                                },
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {documents.length > 0
                                    ? documents.map((file: File, index: number) => {
                                          return (
                                              <div
                                                  onClick={() => handleDownloadFile(file)}
                                                  className="w-fit flex gap-4 items-center bg-white border-1 rounded-md shadow border-gray-300 p-2"
                                                  key={index}
                                              >
                                                  <div className="flex gap-2 items-center">
                                                      <FileText size={16} />
                                                      <div>{file.name}</div>
                                                  </div>
                                              </div>
                                          )
                                      })
                                    : "No files found"}
                            </div>
                            <FileDropZone label="Inspection Documents" onFilesChange={handleFiles} />
                            <div className="flex gap-2 flex-wrap">
                                {documents1.map((file, index) => {
                                    return (
                                        <div className="w-fit flex gap-4 items-center bg-white border-1 rounded-md shadow border-gray-300 p-2" key={index}>
                                            <div className="flex gap-2 items-center">
                                                <FileText size={16} />
                                                <div>{file.name}</div>
                                            </div>
                                            <div>
                                                <X className="cursor-pointer" size={16} onClick={() => handleDeleteObjectInArrayByIndex(index)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="">
                            <Button onClick={handleSubmit} type="submit">
                                Update Inspection
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const InvoiceDetails = ({ invoiceData }: { invoiceData: InvoiceDataPropsExtended }) => {
    return (
        <div className="fixed h-full w-5/12 top-0 right-0 z-50 bg-white border-1 p-20 space-y-8 overflow-auto">
            <main className="space-y-12">
                <section className="space-y-3">
                    <h1>View Invoice - {invoiceData.invoiceNumber}</h1>
                    <p>You are currently viewing invoice</p>
                </section>

                {/* Main Information Section */}
                <section className="border-b-1 pb-12 space-y-4">
                    <div>
                        <h2>Invoice Information</h2>
                        <p>Detailed Information of the Inspection</p>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <Input readOnly label="Invoice number" defaultValue={invoiceData.invoiceNumber} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input readOnly label="Amount" type="number" id="amount" placeholder="99" defaultValue={invoiceData.amount || 0} />
                                <Input readOnly label="Currency" defaultValue={invoiceData.currency?.currency} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input readOnly label="VAT ID" defaultValue={invoiceData.vatId || ""} />
                            <Input readOnly label="LPO" defaultValue={invoiceData.lpo || ""} />
                            <Input readOnly label="Quantity" defaultValue={invoiceData.quantity || 1} />
                        </div>
                        <Input readOnly label="Company name" defaultValue={invoiceData.company || ""} />
                    </div>
                </section>

                {/* Description*/}
                <section className="pb-12 space-y-4">
                    <div className="space-y-1">
                        <h2>Description</h2>
                        <p>Description of Invoice</p>
                    </div>
                    <div className="space-y-4">
                        <TextArea readOnly label="Description" defaultValue={invoiceData.description || ""} />
                    </div>
                </section>
            </main>
        </div>
    )
}
