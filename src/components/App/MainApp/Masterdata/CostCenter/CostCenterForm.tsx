"use client"

import { Input, TextArea, Selectable } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { costCenterDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { modeState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface costCenterFormProps {
    locationsData: selectableProps[]
    groupsData: selectableProps[]
}

export const CostCenterForm = ({ locationsData, groupsData }: costCenterFormProps) => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [costCenterData, setCostCenterData] = useRecoilState(costCenterDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetCostCenterData = useResetRecoilState(costCenterDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setCostCenterData({ ...costCenterData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        console.log(costCenterData)
        if (mode === "create") {
            createCostCenter()
        } else {
            updateCostCenter()
        }
    }

    const createCostCenter = async () => {
        const { name, description, location, group } = costCenterData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/cost-center`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                location: location?.value,
                group: group?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Cost center successfully created")
            setLoading(false)
            resetCostCenterData()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error)
            setLoading(false)
        }
    }

    const updateCostCenter = async () => {
        const { id, name, description, location, group } = costCenterData
        if (!name || !description || !location || !group) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/cost-center`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                location: location.value,
                group: group.value,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Cost center successfully updated")
            setLoading(false)
            resetCostCenterData()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    return (
        <main className="space-y-8 max-w-lg m-auto">
            <div>
                <h1>{mode === "create" ? "Add Cost Center" : "Edit Cost Center"}</h1>
                <p>{mode === "create" ? "Create a new cost center" : "Edit current cost center"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input id="name" size="medium" label="Name" placeholder="Cost Center Name" onChange={handleEventChange} value={costCenterData.name || ""} />
                    <TextArea
                        id="description"
                        label="Description"
                        placeholder="Cost Center Description"
                        onChange={handleEventChange}
                        value={costCenterData.description || ""}
                    />
                    <Selectable
                        value={costCenterData.location}
                        label="Location"
                        options={locationsData}
                        onChange={(e: selectableProps) => setCostCenterData({ ...costCenterData, location: e })}
                    />
                    <Selectable
                        value={costCenterData.group}
                        label="Group"
                        options={groupsData}
                        onChange={(e: selectableProps) => setCostCenterData({ ...costCenterData, group: e })}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
