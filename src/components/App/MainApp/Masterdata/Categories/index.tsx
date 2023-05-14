"use client"

import * as React from "react"
import { AllCategories } from "./Categories"
import { CategoryForm } from "./CategoryForm"
import { useRecoilState } from "recoil"
import { modeState } from "@/lib/recoil/masterdata"

export const Categories = ({ categoriesData }: { categoriesData: never[] }) => {
    const [mode, setMode] = useRecoilState(modeState)
    const modifiedCategoriesData = categoriesData.map(({ id, name }) => {
        return { value: id, label: name }
    })

    if (mode === "create" || mode === "edit") {
        return <CategoryForm categoriesData={modifiedCategoriesData} />
    }
    return (
        <React.Suspense>
            <AllCategories categoriesData={categoriesData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
        </React.Suspense>
    )
}
