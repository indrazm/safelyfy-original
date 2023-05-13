"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { categoryDataState } from "@/lib/recoil/masterdata"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { useRouter } from "next/navigation"
import { Selectable } from "@/components/shared/ui/input"

interface categoryFromProps {
    mode: "create" | "edit"
    categoriesData: selectableProps[]
}

export const CategoryForm = ({ mode = "create", categoriesData }: categoryFromProps) => {
    const router = useRouter()
    const workspaceId = useRecoilValue(workspaceIdState)
    const [categoryData, setCategoryData] = useRecoilState(categoryDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetCategoryData = useResetRecoilState(categoryDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setCategoryData({ ...categoryData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (mode === "create") {
            createCategory()
        } else {
            updateCategory()
        }
    }

    const createCategory = async () => {
        const { name, description, parentId } = categoryData
        if (!name || !description) {
            return
        }
        const res = await fetch(`http://localhost:3000/api/v1/masterdata/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                parentId: parentId?.value,
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            setLoading(false)
            resetCategoryData()
            router.refresh()
        }
    }

    const updateCategory = async () => {
        const { id, name, description, parentId } = categoryData
        if (!name || !description) {
            return
        }
        const res = await fetch(`http://localhost:3000/api/v1/masterdata/categories`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                name,
                description,
                parentId: parentId?.value,
            }),
        })
        const data = await res.json()
        if (data) {
            setLoading(false)
            resetCategoryData()
            window.location.reload()
        }
    }

    return (
        <main className="space-y-8 max-w-lg m-auto">
            <div>
                <h1>{mode === "create" ? "Add Category" : "Edit Category"}</h1>
                <p>{mode === "create" ? "Create a new category" : "Edit current category"}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        size="medium"
                        name="name"
                        label="Name"
                        id="name"
                        placeholder="Category Name"
                        onChange={handleEventChange}
                        value={categoryData.name || ""}
                    />
                    <TextArea
                        name="description"
                        label="Description"
                        id="description"
                        placeholder="Category Description"
                        onChange={handleEventChange}
                        value={categoryData.description || ""}
                    />
                    <Selectable
                        value={categoryData.parentId}
                        options={categoriesData}
                        onChange={(e: selectableProps) => setCategoryData({ ...categoryData, parentId: e })}
                    />
                    <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                </div>
            </form>
            <div></div>
        </main>
    )
}
