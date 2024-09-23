"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { costCenterProps } from "@/lib/recoil/masterdata"
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { costCenterDataState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const AllCostCenter = ({ costCentersData, onAdd, onEdit }: { costCentersData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(costCentersData)
    const [costCenterData, setCostCenterData] = useRecoilState(costCenterDataState)
    const resetCostCenterData = useResetRecoilState(costCenterDataState)
    const setLoading = useSetRecoilState(loadingState)

    const deleteCostCenter = async (id: string) => {
        const res = await fetch(`${apiUrlClient}/v1/masterdata/cost-center?deleteId=${id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Cost center deleted successfully")
            setLoading(false)
            resetCostCenterData()
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
            title: "Location",
            render: (res: any) => {
                return <div>{res.location?.name}</div>
            },
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
            render: (e: costCenterProps) => {
                const location = { value: e.location?.id as string, label: e.location?.name as string }
                const group = { value: e.group?.id as string, label: e.group?.name as string }

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setCostCenterData({
                                    ...costCenterData,
                                    id: e.id,
                                    name: e.name,
                                    email: e.email,
                                    description: e.description,
                                    location,
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
                                deleteCostCenter(e.id as string)
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
        const newData = costCentersData.filter((item: { name: string }) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setModifiedData(newData)
    }, [searchTerm, costCentersData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Cost center</h2>
                <p>Here is all of workspace&lsquo;s cost center data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Cost Center
                </Button>
            </div>
            <Table scroll={{ x: true, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="fixed" />
        </div>
    )
}
