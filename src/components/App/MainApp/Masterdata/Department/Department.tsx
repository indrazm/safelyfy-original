"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { departmentProps } from "@/lib/recoil/masterdata"
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { departmentDataState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const AlLDepartment = ({ departmentsData, onAdd, onEdit }: { departmentsData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(departmentsData)
    const [departmentData, setDepartmentData] = useRecoilState(departmentDataState)
    const resetDepartmentDataState = useResetRecoilState(departmentDataState)
    const setLoading = useSetRecoilState(loadingState)

    const deleteDepartment = async (id: string) => {
        const res = await fetch(`${apiUrlClient}/v1/masterdata/department?deleteId=${id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Department deleted successfully")
            setLoading(false)
            resetDepartmentDataState()
            router.refresh()
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

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
            title: "Group",
            render: (res: any) => {
                return <div>{res.group?.name}</div>
            },
        },
        {
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 160,
            render: (e: departmentProps) => {
                const group = { value: e.group?.id as string, label: e.group?.name as string }

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setDepartmentData({
                                    ...departmentData,
                                    id: e.id,
                                    name: e.name,
                                    description: e.description,
                                    group,
                                })
                                onEdit()
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                deleteDepartment(e.id as string)
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]

    React.useEffect(() => {
        const newData = departmentsData.filter((item: { name: string }) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setModifiedData(newData)
    }, [searchTerm, departmentsData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Department</h2>
                <p>Here is all of workspace&lsquo;s department data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Department
                </Button>
            </div>
            <Table scroll={{ x: true, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="fixed" />
        </div>
    )
}
