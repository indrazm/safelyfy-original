"use client"

import * as React from "react"
import { AllCostCenter } from "./CostCenter"
import { CostCenterForm } from "./CostCenterForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

interface costCenterProps {
    costCentersData: never[]
    locationsData: never[]
    groupsData: never[]
}

export const CostCenter = ({ costCentersData, locationsData, groupsData }: costCenterProps) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <CostCenterForm locationsData={locationsData} groupsData={groupsData} />
    }
    return <AllCostCenter costCentersData={costCentersData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
