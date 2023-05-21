"use client"

import * as React from "react"
import { Button } from "@/components/shared/ui/button"
import { Input, TextArea } from "@/components/shared/ui/input"
import { thingProps } from "@/lib/recoil/thing"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { listingFiles } from "@/lib/supabase/storage"
import { FileText } from "lucide-react"

interface ThingViewProps {
    thingData: thingProps
}

export const ThingView = ({ thingData }: ThingViewProps) => {
    const currentPath = usePathname()
    const [documents, setDocuments] = React.useState<any>([])

    const handleLoadFiles = async () => {
        const { data } = await listingFiles({ bucket: "things", folderId: thingData.id as string })
        setDocuments(data)
    }

    React.useEffect(() => {
        handleLoadFiles()
    }, [thingData])

    return (
        <main className="space-y-12">
            <section className="grid grid-cols-2 items-end">
                <div className="space-y-1">
                    <h1>{thingData.idNumber}</h1>
                    <p>You are currently view thing</p>
                </div>
                <div className="flex gap-4 justify-end">
                    <Link href={`${currentPath}/all-inspection`}>
                        <Button auto size="small" variant="secondary">
                            Inspection History
                        </Button>
                    </Link>

                    <Link href={`${currentPath}/add-inspection`}>
                        <Button auto size="small" variant="secondary">
                            Add Inspection
                        </Button>
                    </Link>
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
                            <Input readOnly label="Capacity 2" value={thingData.capacity?.capacity2 || 0} />
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
                            <Input readOnly label="Status" value={thingData.status?.name} />
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
                <div className="w-[calc(100%-320px)] space-y-4">
                    <div className="space-y-4">
                        <TextArea readOnly label="Remarks" value={thingData.remarks || ""} />
                    </div>
                    <div className="space-y-1">
                        <div className="block text-gray-900 font-medium">Documents</div>
                        <div className="flex gap-2 flex-wrap">
                            {documents.length > 0
                                ? documents.map((file: File, index: number) => {
                                      return (
                                          <div className="w-fit flex gap-4 items-center bg-white border-1 rounded-md shadow border-gray-300 p-2" key={index}>
                                              <div className="flex gap-2 items-center">
                                                  <FileText size={16} />
                                                  <div>{file.name}</div>
                                              </div>
                                          </div>
                                      )
                                  })
                                : "No files found"}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
