"use client"

import * as React from "react"
import { AllManufacturer } from "./Manufacturer"
import { ManufacturerForm } from "./ManufacturerForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

export const Manufacturer = ({ manufacturersData }: { manufacturersData: never[] }) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <ManufacturerForm />
    }
    return <AllManufacturer manufacturersData={manufacturersData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
