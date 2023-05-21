"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Tag } from "@/components/shared/ui/tag"
import { Input } from "@/components/shared/ui/input"
// import { Card } from "@/components/shared/ui/card"
// import { PlusCircle } from "lucide-react"
// import { Tag } from "@/components/shared/ui/tag"
import Link from "next/link"
// import groupArray from "group-array"
// import OutsideClickHandler from "react-outside-click-handler"
// import { findStringInArray } from "@/lib/findStringInArray"
import { inspectionDataProps } from "@/lib/recoil/inspection"
import { useParams } from "next/navigation"

interface inspectionDataPropsExtended extends Omit<inspectionDataProps, "status"> {
    thingId: {
        idNumber: string
    }
    status: {
        name: string
        color: "valid" | "danger" | "warning" | "gray"
    }
}

export const AllInspection = ({ inspectionData }: { inspectionData: inspectionDataProps[] }) => {
    const { workspaceId } = useParams()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(inspectionData)

    const columns = [
        {
            title: "Inspection Number",
            dataIndex: "inspectionNumber",
            key: "inspectionNumber",
        },
        {
            title: "Thing Id",
            render: (e: inspectionDataPropsExtended) => {
                return <div>{e.thingId.idNumber}</div>
            },
        },
        {
            title: "Status",
            render: (e: inspectionDataPropsExtended) => {
                return <Tag variant={e.status.color}>{e.status?.name}</Tag>
            },
        },
        {
            title: "Inspection Date",
            dataIndex: "inspectionDate",
            key: "inspectionDate",
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiryDate",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 100,
            render: (e: inspectionDataProps) => {
                return (
                    <Link href={`/${workspaceId}/inspection/${e.id}`}>
                        <Button auto size="small" variant="secondary">
                            View
                        </Button>
                    </Link>
                )
            },
        },
    ]

    // Filter by search term
    const filterBySearchTerm = (data: never[]) => {
        return data.filter((item: inspectionDataProps) => {
            return item.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }

    React.useEffect(() => {
        const filteredData = [...inspectionData] as never[]

        // Filter by searchTerm is always applied
        const modified = filterBySearchTerm(filteredData)

        setModifiedData(modified)
    }, [searchTerm, inspectionData])

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2>Inspections</h2>
                    <p>Here is all of workspace&lsquo;s inspections data</p>
                </div>
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
                        </div>
                    </div>
                </div>
                <Table scroll={{ x: 1400, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="auto" />
            </section>
        </div>
    )
}
