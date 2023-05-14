"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { thingDataState } from "@/lib/recoil/thing"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { Selectable } from "@/components/shared/ui/input"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { toast } from "react-hot-toast"
import { modeState } from "@/lib/recoil/masterdata"
import { useRouter } from "next/navigation"
import moment from "moment"

interface ThingFormProps {
    costCentersData: selectableProps[]
    categoriesData: selectableProps[]
    manufacturersData: selectableProps[]
    capacityUnitsData: selectableProps[]
    schedulesData: selectableProps[]
    statusData: selectableProps[]
}

export const ThingForm = ({ costCentersData, categoriesData, manufacturersData, capacityUnitsData, schedulesData, statusData }: ThingFormProps) => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [thingData, setThingData] = useRecoilState(thingDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetThingDataState = useResetRecoilState(thingDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setThingData({ ...thingData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createThing()
        } else {
            updateThing()
        }
    }

    const createThing = async () => {
        const { name, description, parentId } = categoryData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                parentId: parentId?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Category successfully created")
            setLoading(false)
            resetThingDataState()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    const updateThing = async () => {
        const { id, name, description, parentId } = categoryData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/categories`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                parentId: parentId?.value,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Category successfully updated")
            setLoading(false)
            resetThingDataState()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    React.useEffect(() => {
        const fullDate = new Date().toString()
        const todayDate = moment(fullDate).format("yyyy-MM-DD")
        setThingData({ ...thingData, expiryDate: todayDate, inspectionDate: todayDate })
    }, [])

    return (
        <main className="space-y-12">
            <section className="space-y-1">
                <h1>Add Thing</h1>
                <p>You are currently creating new thing</p>
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
                            <Input label="Id Number" id="idNumber" placeholder="ID-XXX-XXXX" onChange={handleEventChange} value={thingData.idNumber || ""} />
                            <Input label="Serial Number" id="serialNumber" placeholder="XXXXX" onChange={handleEventChange} value={thingData.idNumber || ""} />
                        </div>
                        <TextArea
                            name="description"
                            label="Description"
                            id="description"
                            placeholder="Thing Description"
                            onChange={handleEventChange}
                            value={thingData.description || ""}
                        />

                        <Selectable
                            label="Cost Center"
                            value={thingData.costCenter}
                            options={costCentersData}
                            // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <Selectable
                                label="Main Category"
                                // value={thingData.costCenter}
                                options={categoriesData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
                            <Selectable
                                label="Sub Category"
                                // value={thingData.costCenter}
                                options={categoriesData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
                            <Selectable
                                label="Category"
                                // value={thingData.costCenter}
                                options={categoriesData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
                        </div>
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
                        <Input label="Model" id="model" placeholder="2000" onChange={handleEventChange} value={thingData.model || ""} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Year manufacturer"
                                id="yearManufacturer"
                                placeholder="2000"
                                onChange={handleEventChange}
                                value={thingData.yearManufacture || ""}
                            />
                            <Selectable
                                label="Manufacturer"
                                // value={thingData.costCenter}
                                options={manufacturersData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
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
                            <Input
                                type="number"
                                label="Capacity 1"
                                id="capacity1"
                                placeholder="0"
                                onChange={handleEventChange}
                                value={thingData.capacity1 || 0}
                            />
                            <Input
                                type="number"
                                label="Capacity 2"
                                id="capacity2"
                                placeholder="0"
                                onChange={handleEventChange}
                                value={thingData.capacity2 || 0}
                            />
                            <Input
                                type="number"
                                label="Capacity 3"
                                id="capacity3"
                                placeholder="0"
                                onChange={handleEventChange}
                                value={thingData.capacity3 || 0}
                            />
                        </div>
                        <Selectable
                            label="Capacity Unit"
                            // value={thingData.costCenter}
                            options={capacityUnitsData}
                            // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                        />
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
                            <Selectable
                                label="Status"
                                // value={thingData.costCenter}
                                options={statusData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
                            <Selectable
                                label="Schedule"
                                // value={thingData.costCenter}
                                options={schedulesData}
                                // onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                            />
                            <Input type="date" id="expiryDate" label="Expiry Date" value={thingData.expiryDate || ""} onChange={handleEventChange} />
                            <Input
                                type="date"
                                id="inspectionDate"
                                label="Inspection Date"
                                value={thingData.inspectionDate || ""}
                                onChange={handleEventChange}
                            />
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
                        <TextArea label="Remarks" id="remarks" value={thingData.remarks || ""} onChange={handleEventChange} />
                        <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
