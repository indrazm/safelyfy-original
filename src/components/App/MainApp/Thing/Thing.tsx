"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { thingProps } from "@/lib/recoil/thing"
import { PlusCircle } from "lucide-react"
import { Tag } from "@/components/shared/ui/tag"
// import groupArray from "group-array"

export const AllThing = ({ thingsData, onAdd }: { thingsData: never[]; onAdd: () => void }) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(thingsData)

    const [statusListOpen, setStatusListOpen] = React.useState(false)
    // const statusAvailable = groupArray(thingsData, "status.id")
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
            render: (e: { status: { color: "valid" | "danger" | "warning" | "gray"; name: string } }) => {
                console.log(e)
                return <Tag variant={e.status?.color}>{e.status?.name}</Tag>
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
                <div className="min-w-[280px] max-w-[400px] flex gap-4">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="relative">
                        <Button auto variant="ghost" size="small" onClick={() => setStatusListOpen(!statusListOpen)}>
                            <div className="flex gap-2 items-center">
                                <PlusCircle size={12} /> Status
                            </div>
                        </Button>
                        {/* {statusListOpen && (
                            <Card className="absolute z-50 bg-white p-3">
                                <ul>
                                    {.map((status, index) => {
                                        return <li key={index}>{JSON.stringify(status)}</li>
                                    })}
                                </ul>
                            </Card>
                        )} */}
                    </div>
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Thing
                </Button>
            </div>
            <Table scroll={{ x: 1600, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="auto" />
        </div>
    )
}
