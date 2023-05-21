"use client"

import { FileDropZone, Input, TextArea } from "@/components/shared/ui/input"
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
import type { categoryProps } from "@/lib/recoil/masterdata"
import { handleUploadFiles } from "@/lib/supabase/storage"
import { FileWithPath } from "react-dropzone"
import { FileText, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
interface ThingFormProps {
    costCentersData: selectableProps[]
    categoriesData: categoryProps[]
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
    const [currentMainCategory, setCurrentMainCategory] = React.useState<selectableProps | null>(null)
    const [currentSubCategory, setCurrentSubCategory] = React.useState<selectableProps | null>(null)
    const [documents, setDocuments] = React.useState<FileWithPath[]>([])

    const mainCategoriesData = categoriesData
        .filter((item: categoryProps) => item.parentId === null)
        .map((item: categoryProps) => {
            return { value: item.id as string, label: item.name }
        })
    const subCategoriesData = categoriesData
        .filter((e: categoryProps) => e.parentId?.id === currentMainCategory?.value)
        .map((item: categoryProps) => {
            return { value: item.id as string, label: item.name }
        })
    const availableCategoriesData = categoriesData
        .filter((e: categoryProps) => e.parentId?.id === currentSubCategory?.value)
        .map((item: categoryProps) => {
            return { value: item.id as string, label: item.name }
        })

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setThingData({ ...thingData, [id]: value })
    }

    const handleFiles = (files: FileWithPath[]) => {
        const filesArray = [...documents]
        files.forEach((file) => {
            filesArray.push(file)
        })
        setDocuments(filesArray)
    }

    const handleDeleteObjectInArrayByIndex = (index: number) => {
        const filesArray = [...documents]
        filesArray.splice(index, 1)
        setDocuments(filesArray)
    }

    const handleSubmit = async () => {
        setLoading(true)
        createThing()
    }

    const createThing = async () => {
        const user = await supabase.auth.getUser()
        const userId = user.data.user?.id
        const {
            idNumber,
            serialNumber,
            description,
            category,
            yearManufacture,
            model,
            capacity1,
            capacity2,
            capacity3,
            capacityUnit,
            schedule,
            status,
            remarks,
            manufacturer,
            parentId,
            expiryDate,
            inspectionDate,
            costCenter,
        } = thingData
        if (!idNumber || !description || !category || !yearManufacture || !model || !capacity1 || !capacityUnit || !schedule) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/thing`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idNumber,
                serialNumber,
                description,
                category: category?.value,
                yearManufacture,
                model,
                capacity1,
                capacity2,
                capacity3,
                capacityUnit: capacityUnit?.value,
                schedule: schedule?.value,
                status: status?.value,
                remarks,
                manufacturer: manufacturer?.value,
                parentId,
                submittedBy: userId,
                expiryDate,
                inspectionDate,
                costCenter: costCenter?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            handleUploadFiles({ bucket: "things", files: documents, folderId: data.data.id })
            toast.success("Thing successfully created")
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
        const setTodayDate = setTimeout(() => {
            setThingData({ ...thingData, expiryDate: todayDate, inspectionDate: todayDate, status: statusData[8] })
        }, 100)

        return () => clearTimeout(setTodayDate)
    }, [statusData])

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
                            <Input
                                label="Serial Number"
                                id="serialNumber"
                                placeholder="XXXXX"
                                onChange={handleEventChange}
                                value={thingData.serialNumber || ""}
                            />
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
                            onChange={(e: selectableProps) => setThingData({ ...thingData, costCenter: e })}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <Selectable
                                label="Main Category"
                                value={currentMainCategory}
                                options={mainCategoriesData}
                                onChange={(e: selectableProps) => setCurrentMainCategory(e)}
                            />
                            <Selectable
                                label="Sub Category"
                                value={currentSubCategory}
                                options={subCategoriesData}
                                onChange={(e: selectableProps) => setCurrentSubCategory(e)}
                            />
                            <Selectable
                                label="Category"
                                value={thingData.category}
                                options={availableCategoriesData}
                                onChange={(e: selectableProps) => setThingData({ ...thingData, category: e })}
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
                                id="yearManufacture"
                                placeholder="2000"
                                onChange={handleEventChange}
                                value={thingData.yearManufacture || ""}
                            />
                            <Selectable
                                label="Manufacturer"
                                value={thingData.manufacturer}
                                options={manufacturersData}
                                onChange={(e: selectableProps) => setThingData({ ...thingData, manufacturer: e })}
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
                            value={thingData.capacityUnit}
                            options={capacityUnitsData}
                            onChange={(e: selectableProps) => setThingData({ ...thingData, capacityUnit: e })}
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
                                value={thingData.status}
                                options={statusData}
                                onChange={(e: selectableProps) => setThingData({ ...thingData, status: e })}
                            />
                            <Selectable
                                label="Schedule"
                                value={thingData.schedule}
                                options={schedulesData}
                                onChange={(e: selectableProps) => setThingData({ ...thingData, schedule: e })}
                            />
                            <Input type="date" id="expiryDate" label="Expiry Date" value={thingData.expiryDate} onChange={(e) => console.log(e.target.value)} />
                            <Input type="date" id="inspectionDate" label="Inspection Date" value={thingData.inspectionDate} onChange={handleEventChange} />
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
                        <TextArea label="Remarks" id="remarks" placeholder="Remarks..." value={thingData.remarks || ""} onChange={handleEventChange} />
                        <FileDropZone label="Thing Documents" onFilesChange={handleFiles} />
                        <div className="flex gap-2 flex-wrap">
                            {documents.map((file, index) => {
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
                        <Button onClick={handleSubmit} type="submit">
                            {mode === "create" ? "Create" : "Update"}
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
