"use client"

import * as React from "react"
import { Input, TextArea } from "@/components/shared/ui/input"
import { invoiceDataProps } from "@/lib/recoil/invoice"

interface InvoicePropsExtended extends Omit<invoiceDataProps, "currency"> {
    currency: { currency: string }
}

interface InvoiceFormProps {
    invoiceData: InvoicePropsExtended
}

export const InvoiceView = ({ invoiceData }: InvoiceFormProps) => {
    return (
        <>
            <main className="space-y-12">
                <section className="space-y-3">
                    <h1>View Invoice - {invoiceData.invoiceNumber}</h1>
                    <p>You are currently viewing invoice</p>
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
                                <Input label="Invoice number" value={invoiceData.invoiceNumber} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Amount" type="number" id="amount" placeholder="99" value={invoiceData.amount || 0} />
                                    <Input label="Currency" value={invoiceData.currency?.currency} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="VAT ID" value={invoiceData.vatId || ""} />
                                <Input label="LPO" value={invoiceData.lpo || ""} />
                                <Input label="Quantity" value={invoiceData.quantity || 1} />
                            </div>
                            <Input label="Company name" value={invoiceData.company || ""} />
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
                            <TextArea label="Description" value={invoiceData.description || ""} />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
