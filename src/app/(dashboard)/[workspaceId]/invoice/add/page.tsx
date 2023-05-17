import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InvoiceForm } from "@/components/App/MainApp/Invoice/InvoiceForm"

export default async function Page() {
    const currencyData = await getCurrencyData()

    return <InvoiceForm currencyData={currencyData} />
}

async function getCurrencyData() {
    const response = await fetch(`${apiUrlServer}/v1/globals/currency`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: { id: string; currency: string }) => {
        return { value: item.id, label: item.currency }
    })
    return modifiedData
}
