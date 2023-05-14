"use client"

import { Input, TextArea, Selectable } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { departmentDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { modeState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface departmentProps {
    groupsData: selectableProps[]
}

export const DepartmentForm = ({ groupsData }: departmentProps) => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [departmentData, setDepartmentData] = useRecoilState(departmentDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetDepartmentDataState = useResetRecoilState(departmentDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setDepartmentData({ ...departmentData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createDepartment()
        } else {
            updateDepartment()
        }
    }

    const createDepartment = async () => {
        const { name, description, group } = departmentData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/department`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                group: group?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Cost center successfully created")
            setLoading(false)
            resetDepartmentDataState()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error)
            setLoading(false)
        }
    }

    const updateDepartment = async () => {
        const { id, name, description, group } = departmentData
        if (!name || !description || !location || !group) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/department`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                group: group ? group?.value : null,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Department successfully updated")
            setLoading(false)
            resetDepartmentDataState()
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
                <h1>{mode === "create" ? "Add Department" : "Edit Department"}</h1>
                <p>{mode === "create" ? "Create a new department" : "Edit current department"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input id="name" size="medium" label="Name" placeholder="Department Name" onChange={handleEventChange} value={departmentData.name || ""} />
                    <TextArea
                        id="description"
                        label="Description"
                        placeholder="Department Description"
                        onChange={handleEventChange}
                        value={departmentData.description || ""}
                    />
                    <Selectable
                        value={departmentData.group}
                        label="Group"
                        options={groupsData}
                        onChange={(e: selectableProps) => setDepartmentData({ ...departmentData, group: e })}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
