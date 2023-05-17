"use client"

import * as React from "react"
import Table from "rc-table"
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/shared/ui/input"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { invoiceDataProps } from "@/lib/recoil/invoice"

interface InvoicePropsExtended extends Omit<invoiceDataProps, "currency"> {
    currency: { currency: string }
}

export const AllInvoice = ({ invoicesData }: { invoicesData: invoiceDataProps[] }) => {
    const currentPath = usePathname()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [modifiedData, setModifiedData] = React.useState(invoicesData)

    const columns = [
        {
            title: "Invoice Number",
            dataIndex: "invoiceNumber",
            key: "invoiceNumber",
        },
        {
            title: "Amount",
            key: "amount",
            render: (e: InvoicePropsExtended) => {
                return (
                    <div>
                        {e.currency?.currency} - {e.amount}
                    </div>
                )
            },
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "operations",
            width: 100,
            render: (e: InvoicePropsExtended) => {
                return (
                    <Link href={`${currentPath}/${e.id}/`}>
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
        return data.filter((item: invoiceDataProps) => {
            return item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }

    React.useEffect(() => {
        const filteredData = [...invoicesData] as never[]

        // Filter by searchTerm is always applied
        const modified = filterBySearchTerm(filteredData)

        setModifiedData(modified)
    }, [searchTerm, invoicesData])

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2>Invoices</h2>
                    <p>Here is all of workspace&lsquo;s invoices data</p>
                </div>
            </div>
            <section className="space-y-4">
                <div className="flex justify-between items-end gap-4">
                    <Input className="w-[320px]" size="small" placeholder="Search something..." type="search" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Table scroll={{ x: true, y: 600 }} rowKey="id" columns={columns} data={modifiedData} tableLayout="auto" />
            </section>
        </div>
    )
}
