"use client"

import * as React from "react"
import { Button } from "@/components/shared/ui/button"
import { Input, TextArea, FileDropZone } from "@/components/shared/ui/input"
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
import { useQRCode } from 'next-qrcode';

interface InvoiceDataPropsExtended extends Omit<invoiceDataProps, "currency"> {
    currency: {
        currency: string
    }
}

interface InspectionViewProps {
    inspectionData: InspectionData
    invoiceData: InvoiceDataPropsExtended
}

interface InspectionData extends Omit<inspectionDataProps, "inspector"> {
    inspector: {
        full_name: string
        avatar: string
    }
    invoiceNumber: {
        invoiceNumber: string
    }
}

export const InspectionView = ({ inspectionData, invoiceData }: InspectionViewProps) => {
    const router = useRouter()
    const params = useParams()
    const { Canvas } = useQRCode();
    const { inspectionId } = params
    const setLoading = useSetRecoilState(loadingState)
    const [thingQrOpen, setThingQrOpen] = React.useState(false)
    
    const [invoiceInformationOpen, setInvoiceInformationOpen] = React.useState(false)
    const [documents, setDocuments] = React.useState<any>([])
    const [documents1, setDocuments1] = React.useState<FileWithPath[]>([])
    const [qrurl, setQrUrl] = React.useState<any>([])

    const handleLoadFiles = async () => {
        const { data } = await listingFiles({ bucket: "inspections", folderId: inspectionData.id as string })
        if(data && data?.length > 0) {
            const urlqr = supabase.storage.from('inspections').getPublicUrl(`${inspectionId}/${data[0].name}`)
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

    const handleSubmit = async () => {
        setLoading(true)
        updateInspection()
    }

    const updateInspection = async () => {
        handleUploadFiles({ bucket: "inspections", files: documents1, folderId: inspectionData.id as string })
        toast.success("Inspection document successfully uploaded.")
        setLoading(false)
        router.refresh()
        // router.back()
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
                        <div><p>You are currently view inspection</p></div>
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
                                <Input readOnly label="Inspection date" value={inspectionData.inspectionDate?.toString()} />
                                <Input readOnly label="Expiry date" value={inspectionData.expiryDate?.toString()} />
                            </div>
                            <Input readOnly label="Inspector" value={inspectionData.inspector?.full_name} />
                            <Input readOnly label="Status" value={inspectionData.status?.name} />
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
                        <Input readOnly label="Timesheet" value={inspectionData.timesheet} />
                        <Input readOnly label="Invoice" value={inspectionData.invoiceNumber?.invoiceNumber} />
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
                            <TextArea readOnly label="Findings" id="findings" placeholder="2000" value={inspectionData.findings} />
                            <Input readOnly label="Operator" id="operator" placeholder="Operator" value={inspectionData.operator} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input readOnly label="Certificate number" value={inspectionData.certificateNumber} />
                                <Input readOnly label="Certificate receiver" value={inspectionData.certificateReceiver} />
                            </div>
                            <div>Files</div>
                            <div>
                            {thingQrOpen && (
                                <>
                                    <Canvas
                                        text={qrurl}
                                        options={{
                                            errorCorrectionLevel: 'M',
                                            margin: 3,
                                            scale: 4,
                                            width: 200,
                                            color: {
                                            dark: '#000000',
                                            light: '#ffffff',
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
                                Upload Inspection Document
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
                            <Input label="Invoice number" value={invoiceData.invoiceNumber} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Amount" type="number" id="amount" placeholder="99" value={invoiceData.amount || 0} />
                                <Input label="Currency" value={invoiceData.currency?.currency} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="VAT ID" value={invoiceData.vatId || ""} />
                            <Input label="LPO" value={invoiceData.lpo || ""} />
                            <Input label="Quantity" value={invoiceData.quantity || 1} />
                        </div>
                        <Input label="Company name" value={invoiceData.company || ""} />
                    </div>
                </section>

                {/* Description*/}
                <section className="pb-12 space-y-4">
                    <div className="space-y-1">
                        <h2>Description</h2>
                        <p>Description of Invoice</p>
                    </div>
                    <div className="space-y-4">
                        <TextArea label="Description" value={invoiceData.description || ""} />
                    </div>
                </section>
            </main>
        </div>
    )
}
