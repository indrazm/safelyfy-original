"use client"

import * as React from "react"
import { AllCategories } from "./Categories"
import { CategoryForm } from "./CategoryForm"

export const Categories = ({ categoriesData }: { categoriesData: never[] }) => {
    const [mode, setMode] = React.useState<"view" | "create" | "edit">("view")
    const modifiedCategoriesData = categoriesData.map(({ id, name }) => {
        return { value: id, label: name }
    })

    if (mode === "create" || mode === "edit") {
        return <CategoryForm mode={mode} categoriesData={modifiedCategoriesData} />
    }
    return <AllCategories categoriesData={categoriesData} onAdd={() => setMode("create")} onEdit={() => setMode("edit")} />
}
