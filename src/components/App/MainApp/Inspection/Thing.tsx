"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { Card } from "@/components/shared/ui/card"
import { thingProps } from "@/lib/recoil/thing"
import { PlusCircle } from "lucide-react"
import { Tag } from "@/components/shared/ui/tag"
import { usePathname } from "next/navigation"
import Link from "next/link"
import groupArray from "group-array"
import OutsideClickHandler from "react-outside-click-handler"
import { findStringInArray } from "@/lib/findStringInArray"
interface dateRangeProps {
    start: Date | null
    end: Date | null
}

export const AllThing = ({ thingsData, onAdd }: { thingsData: never[]; onAdd: () => void }) => {
    const currentPath = usePathname()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(thingsData)

    const [statusListOpen, setStatusListOpen] = React.useState(false)
    const statusAvailable = Object.entries(groupArray(thingsData, "status.name"))

    const [statusFilter, setStatusFilter] = React.useState<string[]>([])
    const [dateRangeFilter, setDateRangeFilter] = React.useState<dateRangeProps>({
        start: null,
        end: null,
    })

    const handleChangeStatusFilter = (e: React.ChangeEvent<HTMLInputElement>, status: string) => {
        if (e.target.checked) {
            setStatusFilter([...statusFilter, status])
            return
        }
        //remove string from array
        const newFilter = statusFilter.filter((s) => s !== status)
        setStatusFilter(newFilter)
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
            render: (e: { status: { color: "valid" | "danger" | "warning" | "gray"; name: string } }) => {
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
            render: (e: any) => {
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`${currentPath}/${e.id}`}>
                            <Button auto size="small" variant="secondary">
                                View
                            </Button>
                        </Link>
                        <Button auto size="small" variant="secondary">
                            Add Child
                        </Button>
                    </div>
                )
            },
        },
    ]

    // Filter by status
    const filterByStatus = (data: never[]) => {
        return data.filter((item: thingProps) => {
            const name = item.status?.name as string
            // Check if the status.name is in the statusFilter array
            return statusFilter.includes(name)
        })
    }

    // Filter by search term
    const filterBySearchTerm = (data: never[]) => {
        return data.filter((item: thingProps) => {
            return item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }

    // Filter by date range
    const filterByDateRange = (data: never[]) => {
        return data.filter((item: thingProps) => {
            const itemDate = new Date(item.expiryDate)
            const startDate = dateRangeFilter.start as Date
            const endDate = dateRangeFilter.end as Date
            return itemDate >= startDate && itemDate <= endDate
        })
    }

    React.useEffect(() => {
        let filteredData = [...thingsData]

        if (statusFilter.length > 0) {
            filteredData = filterByStatus(filteredData)
        }

        if (dateRangeFilter.start && dateRangeFilter.end) {
            filteredData = filterByDateRange(filteredData)
        }

        // Filter by searchTerm is always applied
        filteredData = filterBySearchTerm(filteredData)

        setModifiedData(filteredData)
    }, [searchTerm, thingsData, statusFilter, dateRangeFilter])

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2>Thing</h2>
                    <p>Here is all of workspace&lsquo;s things data</p>
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Thing
                </Button>
            </div>
            <section className="space-y-4">
                <div className="flex justify-between items-end gap-4">
                    <div className="flex gap-4">
                        <div className="flex gap-4 ">
                            <Input
                                className="w-[320px]"
                                size="small"
                                placeholder="Search something..."
                                type="search"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="relative ">
                                <Button auto variant="ghost" size="small" onClick={() => setStatusListOpen(!statusListOpen)}>
                                    <div className="flex gap-2 items-center divide-x-1">
                                        <div className="flex gap-2 items-center">
                                            <PlusCircle size={12} /> Status
                                        </div>
                                        {statusFilter.length > 0 && (
                                            <div className="flex gap-2 pl-4">
                                                {statusFilter.map((item, index) => (
                                                    <div key={index} className="px-2  bg-gray-100 text-gray-800 text-[9px] font-medium rounded-md">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                                <OutsideClickHandler onOutsideClick={() => setStatusListOpen(false)}>
                                    {statusListOpen && (
                                        <Card className="absolute top-10 w-[140px] bg-white z-50 p-1">
                                            <ul>
                                                {statusAvailable.map((item, index) => {
                                                    return (
                                                        <li
                                                            key={index}
                                                            className="px-2 text-xs font-medium rounded py-1 flex justify-between bg-white hover:bg-gray-200"
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <input
                                                                    checked={findStringInArray(statusFilter, item[0])}
                                                                    type="checkbox"
                                                                    onChange={(e) => handleChangeStatusFilter(e, item[0])}
                                                                />
                                                                {item[0]}
                                                            </div>
                                                            <div>{item[1].length}</div>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </Card>
                                    )}
                                </OutsideClickHandler>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div>Date range filter</div>
                        <Input
                            type="date"
                            className="w-[120px]"
                            size="small"
                            onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, start: new Date(e.target.value) })}
                        />
                        -
                        <Input
                            type="date"
                            className="w-[120px]"
                            size="small"
                            onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, end: new Date(e.target.value) })}
                        />
                    </div>
                </div>
                <Table scroll={{ x: 1600, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="auto" />
            </section>
        </div>
    )
}
