"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { locationProps } from "@/lib/recoil/masterdata"
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { locationDataState } from "@/lib/recoil/masterdata"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const AllLocation = ({ locationsData, onAdd, onEdit }: { locationsData: never[]; onAdd: () => void; onEdit: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(locationsData)
    const [locationData, setLocationData] = useRecoilState(locationDataState)
    const resetLocationDataState = useResetRecoilState(locationDataState)
    const setLoading = useSetRecoilState(loadingState)

    const deleteManufacturer = async (id: string) => {
        const res = await fetch(`${apiUrlClient}/v1/masterdata/location?deleteId=${id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Location deleted successfully")
            setLoading(false)
            resetLocationDataState()
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
            title: "Company",
            dataIndex: "company",
            key: "company",
            width: 200,
        },
        {
            title: "GPS Location",
            dataIndex: "gpsLocation",
            key: "gpsLocation",
            width: 200,
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
                                setLocationData({
                                    ...locationData,
                                    id: e.id,
                                    name: e.name,
                                    description: e.description,
                                    company: e.company,
                                    gpsLocation: e.gpsLocation,
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
                                deleteManufacturer(e.id as string)
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
        const newData = locationsData.filter((item: { name: string }) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setModifiedData(newData)
    }, [searchTerm, locationsData])

    return (
        <div className="space-y-4">
            <div>
                <h2>Location</h2>
                <p>Here is all of workspace&lsquo;s location data</p>
            </div>
            <div className="flex justify-between gap-4">
                <div className="min-w-[280px] max-w-[400px]">
                    <Input size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button auto size="small" onClick={onAdd}>
                    Add Location
                </Button>
            </div>
            <Table scroll={{ x: true, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="fixed" />
        </div>
    )
}
