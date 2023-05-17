"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { inspectionDataProps } from "@/lib/recoil/inspection"

interface InspectionViewProps {
    inspectionData: InspectionData
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

export const InspectionView = ({ inspectionData }: InspectionViewProps) => {
    return (
        <main className="space-y-12">
            <section className="space-y-3">
                <h1>View Inspection</h1>
                <div className="flex justify-between items-center">
                    <p>You are currently view inspection</p>
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
                    </div>
                </div>
            </section>
        </main>
    )
}
