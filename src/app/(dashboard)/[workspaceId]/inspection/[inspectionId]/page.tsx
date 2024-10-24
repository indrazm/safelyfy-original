import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InspectionView } from "@/components/App/MainApp/Inspection/InspectionView"
import { getStatusData, getUsersData } from "../../thing/[thingId]/add-inspection/page"

export default async function Page({ params }: { params: { workspaceId: string; inspectionId: string } }) {
    const { inspectionId } = params
    const inspectionData = await getInspectionData(inspectionId)
    const invoiceId = await inspectionData.invoiceNumber.id
    const invoiceData = await getInvoiceData(invoiceId)
    const invoicesData = await getInvoicesData(params.workspaceId)
    const usersData = await getUsersData(params.workspaceId)
    const statusData = await getStatusData()

    return <InspectionView statusData={statusData} usersData={usersData} inspectionData={inspectionData} invoiceData={invoiceData} invoicesData={invoicesData} />
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
async function getInvoicesData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/invoice?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: { id: string; invoiceNumber: string }) => {
        return { value: item.id, label: item.invoiceNumber }
    })
    return modifiedData
}
