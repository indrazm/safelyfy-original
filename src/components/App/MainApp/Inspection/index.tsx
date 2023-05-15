"use client"

import * as React from "react"
import { AllThing } from "./Thing"
import { ThingForm } from "./InspectionForm"
import { useRecoilState } from "recoil"
import { categoryProps, modeState } from "@/lib/recoil/masterdata"

interface ThingFormProps {
    thingsData: never[]
    costCentersData: selectableProps[]
    categoriesData: categoryProps[]
    manufacturersData: selectableProps[]
    capacityUnitsData: selectableProps[]
    schedulesData: selectableProps[]
    statusData: selectableProps[]
}

export const Thing = ({ thingsData, costCentersData, categoriesData, manufacturersData, capacityUnitsData, schedulesData, statusData }: ThingFormProps) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return (
            <ThingForm
                costCentersData={costCentersData}
                categoriesData={categoriesData}
                manufacturersData={manufacturersData}
                capacityUnitsData={capacityUnitsData}
                schedulesData={schedulesData}
                statusData={statusData}
            />
        )
    }
    return <AllThing thingsData={thingsData} onAdd={() => setMode("create")} />
}
