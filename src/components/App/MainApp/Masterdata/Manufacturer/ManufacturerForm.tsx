"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { manufacturerDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { modeState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const ManufacturerForm = () => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [manufacturerData, setManufacturerData] = useRecoilState(manufacturerDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetManufacturerData = useResetRecoilState(manufacturerDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setManufacturerData({ ...manufacturerData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createManufacturer()
        } else {
            updateManufacturer()
        }
    }

    const createManufacturer = async () => {
        const { name, description, website } = manufacturerData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/manufacturer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                website,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Manufacturer successfully created")
            setLoading(false)
            resetManufacturerData()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error)
            setLoading(false)
        }
    }

    const updateManufacturer = async () => {
        const { id, name, description, website } = manufacturerData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/manufacturer`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                website,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Manufacturer successfully updated")
            setLoading(false)
            resetManufacturerData()
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
                <h1>{mode === "create" ? "Add Manufacturer" : "Edit Manufacturer"}</h1>
                <p>{mode === "create" ? "Create a new manufacturer" : "Edit current manufacturer"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        id="name"
                        size="medium"
                        label="Name"
                        placeholder="Manufacturer Name"
                        onChange={handleEventChange}
                        value={manufacturerData.name || ""}
                    />
                    <TextArea
                        id="description"
                        label="Description"
                        placeholder="Manufacturer Description"
                        onChange={handleEventChange}
                        value={manufacturerData.description || ""}
                    />
                    <Input
                        id="website"
                        size="medium"
                        label="Website"
                        placeholder="Manufacturer Name"
                        onChange={handleEventChange}
                        value={manufacturerData.website || ""}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
