"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { categoryProps } from "@/lib/recoil/masterdata"
import { useRecoilState } from "recoil"
// import { loadingState } from "@/lib/recoil/globals"
import { categoryDataState } from "@/lib/recoil/masterdata"

export const AllCategories = ({ categoriesData, onAdd, onEdit }: { categoriesData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(categoriesData)
    const [categoryData, setCategoryData] = useRecoilState(categoryDataState)
    // const resetCategoryData = useResetRecoilState(categoryDataState)
    // const setLoading = useSetRecoilState(loadingState)

    // const deleteCategory = async (id: string) => {
    //     const res = await fetch(`http://localhost:3000/api/v1/masterdata/categories?deleteId=${id}`, {
    //         method: "DELETE",
    //     })
    //     const data = await res.json()
    //     console.log(data)
    //     if (data) {
    //         setLoading(false)
    //         resetCategoryData()
    //         window.location.reload()
    //     }
    // }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Parent",
            dataIndex: "parentId",
            key: "parentId",
            render: (e: { name: string }) => e?.name,
        },
        {
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 100,
            render: (e: categoryProps) => {
                const parentId = { value: e.parentId?.id as string, label: e.parentId?.name as string }
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setCategoryData({ ...categoryData, id: e.id, name: e.name, description: e.description, parentId })
                                onEdit()
                            }}
                        >
                            Edit
                        </Button>
                        {/* <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                deleteCategory(e.id as string)
                            }}
                        >
                            Delete
                        </Button> */}
                    </div>
                )
            },
        },
    ]

    React.useEffect(() => {
        const newData = categoriesData.filter((item: { name: string }) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setModifiedData(newData)
    }, [searchTerm, categoriesData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Categories</h2>
                <p>Here is all of workspace&lsquo;s categories data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Category
                </Button>
            </div>
            <Table scroll={{ x: 200, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="fixed" />
        </div>
    )
}
