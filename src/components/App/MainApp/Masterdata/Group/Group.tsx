"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { locationProps } from "@/lib/recoil/masterdata"
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { groupDataState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const AllGroup = ({ groupsData, onAdd, onEdit }: { groupsData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(groupsData)
    const [groupData, setGroupData] = useRecoilState(groupDataState)
    const resetGroupDataState = useResetRecoilState(groupDataState)
    const setLoading = useSetRecoilState(loadingState)

    const deleteGroup = async (id: string) => {
        const res = await fetch(`${apiUrlClient}/v1/masterdata/group?deleteId=${id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Group deleted successfully")
            setLoading(false)
            resetGroupDataState()
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
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 160,
            render: (e: locationProps) => {
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setGroupData({
                                    ...groupData,
                                    id: e.id,
                                    name: e.name,
                                    description: e.description,
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
                                deleteGroup(e.id as string)
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
        const newData = groupsData.filter((item: { name: string }) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setModifiedData(newData)
    }, [searchTerm, groupsData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Group</h2>
                <p>Here is all of workspace&lsquo;s group data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Group
                </Button>
            </div>
            <Table scroll={{ x: true, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="fixed" />
        </div>
    )
}
