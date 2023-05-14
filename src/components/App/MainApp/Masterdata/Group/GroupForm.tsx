"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { groupDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { modeState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const GroupForm = () => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [groupData, setGroupData] = useRecoilState(groupDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetGroupDataState = useResetRecoilState(groupDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setGroupData({ ...groupData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createGroup()
        } else {
            updateGroup()
        }
    }

    const createGroup = async () => {
        const { name, description } = groupData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Group successfully created")
            setLoading(false)
            resetGroupDataState()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error)
            setLoading(false)
        }
    }

    const updateGroup = async () => {
        const { id, name, description } = groupData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/group`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Group successfully updated")
            setLoading(false)
            resetGroupDataState()
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
                <h1>{mode === "create" ? "Add Group" : "Edit Group"}</h1>
                <p>{mode === "create" ? "Create a new group" : "Edit current group"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input id="name" size="medium" label="Name" placeholder="Group Name" onChange={handleEventChange} value={groupData.name || ""} />
                    <TextArea
                        id="description"
                        label="Description"
                        placeholder="Group Description"
                        onChange={handleEventChange}
                        value={groupData.description || ""}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
