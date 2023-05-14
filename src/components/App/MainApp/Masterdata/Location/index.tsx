"use client"

import * as React from "react"
import { AllLocation } from "./Location"
import { LocationForm } from "./LocationForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

export const Location = ({ locationsData }: { locationsData: never[] }) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <LocationForm />
    }
    return <AllLocation locationsData={locationsData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
