import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InvoiceView } from "@/components/App/MainApp/Invoice/InspectionView"

export default async function Page({ params }: { params: { invoiceId: string } }) {
    const { invoiceId } = params
    const invoiceData = await getInvoiceData(invoiceId)

    return <InvoiceView invoiceData={invoiceData} />
}

async function getInvoiceData(invoiceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/invoice?invoiceId=${invoiceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
