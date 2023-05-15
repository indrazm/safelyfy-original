"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { Selectable } from "@/components/shared/ui/input"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { toast } from "react-hot-toast"
import { modeState } from "@/lib/recoil/masterdata"
import { useRouter } from "next/navigation"
import { inspectionDataState } from "@/lib/recoil/inspection"
import { thingProps } from "@/lib/recoil/thing"
import OutsideClickHandler from "react-outside-click-handler"

interface InspectionFormProps {
    usersData: selectableProps[]
    invoicesData: selectableProps[]
    statusData: selectableProps[]
    thingId: string
    thingData: thingProps
}

export const InspectionForm = ({ thingData, thingId, usersData, invoicesData, statusData }: InspectionFormProps) => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [inspectionData, setInspectionData] = useRecoilState(inspectionDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetInspectionDataState = useResetRecoilState(inspectionDataState)
    const [thingInformationOpen, setThingInformationOpen] = React.useState(false)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setInspectionData({ ...inspectionData, [id]: value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        console.log({ inspectionData })
        createInspection()
    }

    const createInspection = async () => {
        const { inspectionDate, expiryDate, timesheet, findings, operator, certificateNumber, certificateReceiver, invoice, inspector, status } = inspectionData
        if (!inspectionDate || !expiryDate || !timesheet || !findings || !invoice || !inspector) {
            toast.error("Please fill all fields")
            setLoading(false)
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/inspections`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                thingId,
                inspectionDate,
                expiryDate,
                findings,
                operator,
                certificateNumber,
                certificateReceiver,
                timesheet,
                invoiceNumber: invoice?.value,
                inspector: inspector?.value,
                submittedBy: null,
                status: status?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Inspection successfully created")
            setLoading(false)
            resetInspectionDataState()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    return (
        <>
            {thingInformationOpen && (
                <>
                    <OutsideClickHandler onOutsideClick={() => setThingInformationOpen(false)}>
                        <ThingDetails thingData={thingData} />
                    </OutsideClickHandler>
                    <div className="fixed inset-0 z-40 bg-black/40"></div>
                </>
            )}
            <main className="space-y-12">
                <section className="space-y-3">
                    <h1>Add Inspection</h1>
                    <div className="flex justify-between items-center">
                        <div className="px-4 py-[6px] bg-gray-100 text-gray-600 border-1 border-gray-400 rounded-md w-fit">
                            You are currently creating inspection for thing with Id Number : <strong className="text-black">{thingData.idNumber}</strong>
                        </div>
                        <div>
                            <Button size="small" variant="secondary" onClick={() => setThingInformationOpen(true)}>
                                View thing Information
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
                                    id="inspectionDate"
                                    placeholder="ID-XXX-XXXX"
                                    onChange={handleEventChange}
                                    value={inspectionData.inspectionDate?.toString() || ""}
                                />
                                <Input
                                    type="date"
                                    label="Expiry date"
                                    id="expiryDate"
                                    placeholder="XXXXX"
                                    onChange={handleEventChange}
                                    value={inspectionData.expiryDate?.toString() || ""}
                                />
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
                        <Input
                            label="Timesheet"
                            id="timesheet"
                            placeholder="Timesheet number"
                            value={inspectionData.timesheet || ""}
                            onChange={handleEventChange}
                        />
                        <Selectable
                            label="Invoice"
                            value={inspectionData.invoice}
                            options={invoicesData}
                            onChange={(e: selectableProps) => setInspectionData({ ...inspectionData, invoice: e })}
                        />
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
                            <TextArea label="Findings" id="findings" placeholder="2000" value={inspectionData.findings || ""} onChange={handleEventChange} />
                            <Input label="Operator" id="operator" placeholder="Operator" value={inspectionData.operator || ""} onChange={handleEventChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Certificate number"
                                    id="certificateNumber"
                                    value={inspectionData.certificateNumber || ""}
                                    placeholder="Certificate Number"
                                    onChange={handleEventChange}
                                />
                                <Input
                                    label="Certificate receiver"
                                    id="certificateReceiver"
                                    value={inspectionData.certificateReceiver || ""}
                                    placeholder="Certificate Expiry Date"
                                    onChange={handleEventChange}
                                />
                            </div>
                        </div>
                        <div className="">
                            <Button onClick={handleSubmit} type="submit">
                                Submit Inspection
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const ThingDetails = ({ thingData }: { thingData: thingProps }) => {
    return (
        <div className="fixed h-full w-1/3 top-0 right-0 z-50 bg-white border-1 p-20 space-y-8 overflow-auto">
            {/* Main Information Section */}
            <div className="px-4 py-2 font-bold bg-emerald-100 text-emerald-700 rounded-md border-1 w-fit">Quick View</div>
            <section className="border-b-1 pb-12 space-y-4">
                <div>
                    <h2>Main Information</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input size="small" readOnly label="Id Number" value={thingData.idNumber || ""} />
                        <Input size="small" readOnly label="Serial Number" value={thingData.serialNumber || ""} />
                    </div>
                    <TextArea size="small" readOnly label="Description" value={thingData.description || ""} />
                    <Input size="small" readOnly label="Cost center" value={thingData.costCenter?.name || ""} />
                    <Input size="small" readOnly label="Category" value={thingData.category?.name || ""} />
                </div>
            </section>

            {/* Year and Manufacturer */}
            <section className="border-b-1 pb-12 space-y-4">
                <div>
                    <h2>Manufacturer</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="space-y-4">
                    <Input size="small" readOnly label="Model" value={thingData.model || ""} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input size="small" readOnly label="Year manufacturer" value={thingData.yearManufacture || ""} />
                        <Input size="small" readOnly label="Manufacturer" value={thingData.manufacturer?.name || ""} />
                    </div>
                </div>
            </section>

            {/* Capacity */}
            <section className="border-b-1 pb-12 space-y-4">
                <div>
                    <h2>Capacity</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Input size="small" readOnly label="Capacity 1" value={thingData.capacity?.capacity1 || 0} />
                            <Input size="small" readOnly label="Capacity 2" value={thingData.capacity?.capacity2 || 0} />{" "}
                            <Input size="small" readOnly label="Capacity 3" value={thingData.capacity?.capacity3 || 0} />
                        </div>
                        <Input size="small" readOnly label="Capacity Unit" value={thingData.capacityUnit?.name || ""} />
                    </div>
                </div>
            </section>

            {/* Status Schedule */}
            <section className="border-b-1 pb-12 space-y-4">
                <div>
                    <h2>Status and schedule</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input size="small" readOnly label="Expiry Date" value={thingData.status?.name} />
                            <Input size="small" readOnly label="Schedule" value={thingData.schedule?.name} />
                            <Input size="small" readOnly type="date" label="Expiry Date" value={thingData.expiryDate} />
                            <Input size="small" readOnly type="date" label="Inspection Date" value={thingData.inspectionDate} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Remarks and Document */}
            <section className="pb-12 space-y-4">
                <div>
                    <h2>Remarks and Document</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div>
                    <div className="space-y-4">
                        <TextArea readOnly label="Remarks" value={thingData.remarks || ""} />
                    </div>
                </div>
            </section>
        </div>
    )
}
