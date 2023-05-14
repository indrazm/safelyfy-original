"use client"

import * as React from "react"
import { AllThing } from "./Thing"
import { ThingForm } from "./ThingForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

export const Thing = ({ thingsData }: { thingsData: never[] }) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <ThingForm />
    }
    return (
        <React.Suspense>
            <AllThing thingsData={thingsData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
        </React.Suspense>
    )
}
