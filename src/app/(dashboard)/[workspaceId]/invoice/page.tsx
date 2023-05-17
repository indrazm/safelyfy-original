import { apiUrlServer } from "@/lib/constant/apiUrl"
import { AllInvoice } from "@/components/App/MainApp/Invoice/Invoice"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const workspaceId = params.workspaceId
    const invoicesData = await getInvoiceData(workspaceId)

    return <AllInvoice invoicesData={invoicesData} />
}

async function getInvoiceData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/invoice?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
