"use client"

import * as React from "react"
import { AlLDepartment } from "./Department"
import { DepartmentForm } from "./DepartmentForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

interface departmentProps {
    groupsData: never[]
    departmentsData: never[]
}

export const Department = ({ departmentsData, groupsData }: departmentProps) => {
    const [mode, setMode] = useRecoilState(modeState)

    if (mode === "create" || mode === "edit") {
        return <DepartmentForm groupsData={groupsData} />
    }
    return <AlLDepartment departmentsData={departmentsData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
