"use client"

import * as React from "react"
import { AllGroup } from "./Group"
import { GroupForm } from "./GroupForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

export const Group = ({ groupsData }: { groupsData: never[] }) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <GroupForm />
    }
    return <AllGroup groupsData={groupsData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
