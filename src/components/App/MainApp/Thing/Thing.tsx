"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { thingDataState, thingProps } from "@/lib/recoil/thing"
import { useRecoilState, useSetRecoilState, useResetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { useRouter } from "next/navigation"

export const AllThing = ({ thingsData, onAdd, onEdit }: { thingsData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(thingsData)
    const [thingData, setThingData] = useRecoilState(thingDataState)
    const resetThingDataState = useResetRecoilState(thingDataState)
    const setLoading = useSetRecoilState(loadingState)

    const deleteThing = async (id: string) => {
        setLoading(true)
        const res = await fetch(`http://localhost:3000/api/v1/masterdata/thing?deleteId=${id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        if (data) {
            setLoading(false)
            resetThingDataState()
            router.refresh()
        }
    }

    const columns = [
        {
            title: "Id Number",
            dataIndex: "idNumber",
            key: "idNumber",
        },
        {
            title: "Serial Number",
            dataIndex: "serialNumber",
            key: "serialNumber",
            width: 160,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiryDate",
        },
        {
            title: "Category",
            render: (e: thingProps) => {
                return e.category?.name
            },
        },
        {
            title: "Status",
            render: (e: thingProps) => {
                return e.status?.name
            },
        },
        {
            title: "Submitted by",
            render: (e: { submittedBy: { full_name: string; avatar_url: string } }) => {
                return (
                    <div>
                        <div>{e.submittedBy?.full_name}</div>
                        <div>{e.submittedBy?.avatar_url}</div>
                    </div>
                )
            },
        },
        {
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 200,
            render: () => {
                return (
                    <div className="flex items-center gap-2">
                        <Button auto size="small" variant="secondary">
                            View
                        </Button>
                        <Button auto size="small" variant="secondary">
                            Add Child
                        </Button>
                    </div>
                )
            },
        },
    ]

    React.useEffect(() => {
        const newData = thingsData.filter(
            (item: { idNumber: string; description: string }) =>
                item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setModifiedData(newData)
    }, [searchTerm, thingsData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Thing</h2>
                <p>Here is all of workspace&lsquo;s things data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Thing
                </Button>
            </div>
            <Table scroll={{ x: 1600, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="auto" />
        </div>
    )
}
