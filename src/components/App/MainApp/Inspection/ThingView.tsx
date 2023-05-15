"use client"

import { Button } from "@/components/shared/ui/button"
import { Input, TextArea } from "@/components/shared/ui/input"
import { Tag } from "@/components/shared/ui/tag"
import { thingProps } from "@/lib/recoil/thing"

interface ThingViewProps {
    thingData: thingProps
}

export const ThingView = ({ thingData }: ThingViewProps) => {
    return (
        <main className="space-y-12">
            <section className="grid grid-cols-2 items-end">
                <div className="space-y-1">
                    <h1>{thingData.idNumber}</h1>
                    <p>You are currently view thing</p>
                </div>
                <div className="flex gap-4 justify-end">
                    <Button auto size="small" variant="secondary">
                        Inspection History
                    </Button>
                    <Button auto size="small" variant="secondary">
                        Add Inspection
                    </Button>
                </div>
            </section>

            {/* Main Information Section */}
            <section className="flex gap-4 border-b-1 pb-12">
                <div className="w-[320px] space-y-1">
                    <h2>Main Information</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="w-[calc(100%-320px)]">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input readOnly label="Id Number" value={thingData.idNumber || ""} />
                            <Input readOnly label="Serial Number" value={thingData.serialNumber || ""} />
                        </div>
                        <TextArea readOnly label="Description" value={thingData.description || ""} />
                        <Input readOnly label="Cost center" value={thingData.costCenter?.name || ""} />
                        <Input readOnly label="Category" value={thingData.category?.name || ""} />
                    </div>
                </div>
            </section>

            {/* Year and Manufacturer */}
            <section className="flex gap-4 border-b-1 pb-12">
                <div className="w-[320px] space-y-1">
                    <h2>Manufacturer</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="w-[calc(100%-320px)]">
                    <div className="space-y-4">
                        <Input readOnly label="Model" value={thingData.model || ""} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input readOnly label="Year manufacturer" value={thingData.yearManufacture || ""} />
                            <Input readOnly label="Manufacturer" value={thingData.manufacturer?.name || ""} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Capacity */}
            <section className="flex gap-4 border-b-1 pb-12">
                <div className="w-[320px] space-y-1">
                    <h2>Capacity</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="w-[calc(100%-320px)]">
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Input readOnly label="Capacity 1" value={thingData.capacity?.capacity1 || 0} />
                            <Input readOnly label="Capacity 2" value={thingData.capacity?.capacity2 || 0} />{" "}
                            <Input readOnly label="Capacity 3" value={thingData.capacity?.capacity3 || 0} />
                        </div>
                        <Input readOnly label="Capacity Unit" value={thingData.capacityUnit?.name || ""} />
                    </div>
                </div>
            </section>

            {/* Status Schedule */}
            <section className="flex gap-4 border-b-1 pb-12">
                <div className="w-[320px] space-y-1">
                    <h2>Status and schedule</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="w-[calc(100%-320px)]">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input readOnly label="Expiry Date" value={thingData.status?.name} />
                            <Input readOnly label="Schedule" value={thingData.schedule?.name} />
                            <Input readOnly type="date" label="Expiry Date" value={thingData.expiryDate} />
                            <Input readOnly type="date" label="Inspection Date" value={thingData.inspectionDate} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Remarks and Document */}
            <section className="flex gap-4 border-b-1 pb-12">
                <div className="w-[320px] space-y-1">
                    <h2>Remarks and Document</h2>
                    <p>Detailed Information of the Thing</p>
                </div>
                <div className="w-[calc(100%-320px)]">
                    <div className="space-y-4">
                        <TextArea readOnly label="Remarks" value={thingData.remarks || ""} />
                    </div>
                </div>
            </section>
        </main>
    )
}
