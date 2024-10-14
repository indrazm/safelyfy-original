"use client"

import * as React from "react"
import { Button } from "@/components/shared/ui/button"
import { Input, TextArea, FileDropZone, Selectable } from "@/components/shared/ui/input"
import { inspectionDataState } from "@/lib/recoil/inspection"
import { useRecoilState, useSetRecoilState } from "recoil"
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
import { useState } from 'react';

interface InvoiceDataPropsExtended extends Omit<invoiceDataProps, "currency"> {
    currency: {
        currency: string
    }
}

interface InspectionViewProps {
    inspectionData: InspectionData
    invoiceData: InvoiceDataPropsExtended
    usersData: selectableProps[]
    invoicesData: selectableProps[]
    statusData: selectableProps[]
    thingId: string
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

export const InspectionView = ({ usersData, statusData, invoiceData }: InspectionViewProps) => {
    const router = useRouter()
    const params = useParams()
    const { Canvas } = useQRCode();
    const { inspectionId } = params
    const [inspectionData, setInspectionData] = useRecoilState(inspectionDataState)
    const setLoading = useSetRecoilState(loadingState)
    const [thingQrOpen, setThingQrOpen] = useState(false)
    
    const [invoiceInformationOpen, setInvoiceInformationOpen] = useState(false)
    const [documents, setDocuments] = useState<any>([])
    const [documents1, setDocuments1] = useState<FileWithPath[]>([])
    const [qrurl, setQrUrl] = useState<any>([])

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

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setInspectionData({ ...inspectionData, [id]: value })
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
                                <Input label="Inspection date" value={inspectionData.inspectionDate?.toString()} onChange={handleEventChange} />
                                <Input label="Expiry date" value={inspectionData.expiryDate?.toString()} onChange={handleEventChange} />
                            </div>
                            <Selectable
                                label="Inspector"
                                value={inspectionData.inspector}
                                options={usersData}
                                onChange={(e: selectableProps) => setInspectionData({ ...inspectionData, inspector: e })}
                            />
                            <Selectable
                                label="Status"
                                value={inspectionData.status}
                                options={statusData}
                                onChange={(e: selectableProps) => setInspectionData({ ...inspectionData, status: e })}
                            />
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
                        <Input label="Timesheet" value={inspectionData.timesheet} onChange={handleEventChange} />
                        <Input label="Invoice" value={inspectionData.invoiceNumber?.invoiceNumber} onChange={handleEventChange} />
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
                            <TextArea label="Findings" id="findings" placeholder="2000" value={inspectionData.findings} onChange={handleEventChange} />
                            <Input label="Operator" id="operator" placeholder="Operator" value={inspectionData.operator} onChange={handleEventChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Certificate number" value={inspectionData.certificateNumber} onChange={handleEventChange} />
                                <Input label="Certificate receiver" value={inspectionData.certificateReceiver} onChange={handleEventChange} />
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
                            {/* <Input label="Invoice number" value={invoiceData.invoiceNumber} /> */}
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
