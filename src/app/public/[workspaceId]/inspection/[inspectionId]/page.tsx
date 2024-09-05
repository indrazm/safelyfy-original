import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InspectionView } from "@/components/App/MainApp/Inspection/InspectionView"

export default async function Page({ params }: { params: { inspectionId: string } }) {
    const { inspectionId } = params
    const inspectionData = await getInspectionData(inspectionId)
    const invoiceId = await inspectionData.invoiceNumber.id
    const invoiceData = await getInvoiceData(invoiceId)

    return <InspectionView inspectionData={inspectionData} invoiceData={invoiceData} />
}

async function getInspectionData(inspectionId: string) {
    const response = await fetch(`${apiUrlServer}/v1/inspections?inspectionId=${inspectionId}`, {
        cache: "no-cache",
    })
    const { data } = await response.json()
    return data
}
async function getInvoiceData(invoiceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/invoice?invoiceId=${invoiceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
