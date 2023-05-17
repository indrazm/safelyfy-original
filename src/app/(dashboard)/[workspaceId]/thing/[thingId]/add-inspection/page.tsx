import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InspectionForm } from "@/components/App/MainApp/Inspection/InspectionForm"

export default async function Page({ params }: { params: { workspaceId: string; thingId: string } }) {
    const { workspaceId, thingId } = params
    const usersData = await getUsersData(workspaceId)
    const invoicesData = await getInvoiceData(workspaceId)
    const statusData = await getStatusData()
    const thingData = await getThingData(thingId)
    const scheduleData = await getScheduleData()

    return (
        <InspectionForm
            thingData={thingData}
            thingId={thingId}
            usersData={usersData}
            invoicesData={invoicesData}
            statusData={statusData}
            scheduleData={scheduleData}
        />
    )
}

async function getUsersData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/globals/users?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: { id: string; full_name: string }) => {
        return { value: item.id, label: item.full_name }
    })
    return modifiedData
}
async function getInvoiceData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/invoice?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: { id: string; invoiceNumber: string }) => {
        return { value: item.id, label: item.invoiceNumber }
    })
    return modifiedData
}
async function getStatusData() {
    const response = await fetch(`${apiUrlServer}/v1/globals/status`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: selectableProps) => {
        return { value: item.id, label: item.name }
    })
    return modifiedData
}
async function getThingData(thingId: string) {
    const response = await fetch(`${apiUrlServer}/v1/thing?thingId=${thingId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
async function getScheduleData() {
    const response = await fetch(`${apiUrlServer}/v1/globals/schedules`, {
        cache: "no-cache",
    })
    const data = await response.json()

    return data
}
