"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { locationDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { modeState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const LocationForm = () => {
    const router = useRouter()
    const [mode, setMode] = useRecoilState(modeState)
    const workspaceId = useRecoilValue(workspaceIdState)
    const [locationData, setLocationData] = useRecoilState(locationDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetLocationData = useResetRecoilState(locationDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setLocationData({ ...locationData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createLocation()
        } else {
            updateLocation()
        }
    }

    const createLocation = async () => {
        const { name, description, company, gpsLocation } = locationData
        if (!name || !description || !company) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/location`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                company,
                gpsLocation,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Location successfully created")
            setLoading(false)
            resetLocationData()
            router.refresh()
            setMode("view")
        }
        if (data.error) {
            toast.error(data.error)
            setLoading(false)
        }
    }

    const updateLocation = async () => {
        const { id, name, description, company, gpsLocation } = locationData
        if (!name || !description) {
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/masterdata/location`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                company,
                gpsLocation,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Location successfully updated")
            setLoading(false)
            resetLocationData()
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
                <h1>{mode === "create" ? "Add Location" : "Edit Location"}</h1>
                <p>{mode === "create" ? "Create a new location" : "Edit current location"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input id="name" size="medium" label="Name" placeholder="Location Name" onChange={handleEventChange} value={locationData.name || ""} />
                    <TextArea
                        id="description"
                        label="Description"
                        placeholder="Location Description"
                        onChange={handleEventChange}
                        value={locationData.description || ""}
                    />
                    <Input id="company" size="medium" label="Company" placeholder="Company" onChange={handleEventChange} value={locationData.company || ""} />
                    <Input
                        id="gpsLocation"
                        size="medium"
                        label="GPS Location"
                        placeholder="GPS Location"
                        onChange={handleEventChange}
                        value={locationData.gpsLocation || ""}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
