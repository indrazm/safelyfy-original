"use client"

import { Input, TextArea } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import * as React from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { workspaceIdState, loadingState } from "@/lib/recoil/globals"
import { Selectable } from "@/components/shared/ui/input"
import { apiUrlClient } from "@/lib/constant/apiUrl"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { invoiceDataState } from "@/lib/recoil/invoice"

interface InvoiceFormProps {
    currencyData: selectableProps[]
}

export const InvoiceForm = ({ currencyData }: InvoiceFormProps) => {
    const router = useRouter()
    const workspaceId = useRecoilValue(workspaceIdState)
    const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState)
    const setLoading = useSetRecoilState(loadingState)
    const resetInvoiceDataState = useResetRecoilState(invoiceDataState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target
        setInvoiceData({ ...invoiceData, [id]: value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        createInvoice()
    }

    const createInvoice = async () => {
        const { invoiceNumber, amount, currency, vatId, lpo, description, company, quantity } = invoiceData
        if (!invoiceNumber || !amount || !currency || !description || !quantity) {
            toast.error("Please fill all fields")
            setLoading(false)
            return
        }
        const res = await fetch(`${apiUrlClient}/v1/invoice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                invoiceNumber,
                amount: Number(amount),
                currency: currency?.value,
                vatId,
                lpo,
                description,
                company,
                quantity: Number(quantity),
                workspaceId,
            }),
        })
        const data = await res.json()
        if (data.data) {
            toast.success("Invoice successfully created")
            setLoading(false)
            resetInvoiceDataState()
            router.refresh()
        }
        if (data.error) {
            toast.error(data.error.message)
            setLoading(false)
        }
    }

    return (
        <>
            <main className="space-y-12">
                <section className="space-y-3">
                    <h1>Add Invoice</h1>
                    <p>You are currently creating invoice</p>
                </section>

                {/* Main Information Section */}
                <section className="flex gap-4 border-b-1 pb-12">
                    <div className="w-[320px] space-y-1">
                        <h2>Invoice Information</h2>
                        <p>Detailed Information of the Inspection</p>
                    </div>
                    <div className="w-[calc(100%-320px)]">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Invoice number"
                                    id="invoiceNumber"
                                    placeholder="INV-XXX-XXXX"
                                    onChange={handleEventChange}
                                    value={invoiceData.invoiceNumber || ""}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        label="Amount"
                                        type="number"
                                        id="amount"
                                        placeholder="99"
                                        onChange={handleEventChange}
                                        value={invoiceData.amount || 0}
                                    />
                                    <Selectable
                                        label="Currency"
                                        value={invoiceData.currency}
                                        options={currencyData}
                                        onChange={(e: selectableProps) => setInvoiceData({ ...invoiceData, currency: e })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="VAT ID" id="vatId" placeholder="XXX-XXXXX" onChange={handleEventChange} value={invoiceData.vatId || ""} />
                                <Input label="LPO" id="lpo" placeholder="XXX-XXXXX" onChange={handleEventChange} value={invoiceData.lpo || ""} />
                                <Input
                                    label="Quantity"
                                    type="number"
                                    id="quantity"
                                    placeholder="1"
                                    onChange={handleEventChange}
                                    value={invoiceData.quantity || 1}
                                />
                            </div>
                            <Input
                                label="Company name"
                                id="company"
                                placeholder="Company name"
                                onChange={handleEventChange}
                                value={invoiceData.company || ""}
                            />
                        </div>
                    </div>
                </section>

                {/* Description*/}
                <section className="flex gap-4 border-b-1 pb-12">
                    <div className="w-[320px] space-y-1">
                        <h2>Description</h2>
                        <p>Description of Invoice</p>
                    </div>
                    <div className="w-[calc(100%-320px)] space-y-4">
                        <div className="space-y-4">
                            <TextArea
                                label="Description"
                                id="description"
                                placeholder="description"
                                value={invoiceData.description || ""}
                                onChange={handleEventChange}
                            />
                        </div>
                        <div className="">
                            <Button onClick={handleSubmit} type="submit">
                                Create Invoice
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
