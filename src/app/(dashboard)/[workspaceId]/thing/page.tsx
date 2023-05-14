import { apiUrlServer } from "@/lib/constant/apiUrl"
import { Thing } from "@/components/App/MainApp/Thing"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const thingsData = await getThingData(workspaceId)

    return <Thing thingsData={thingsData} />
}

async function getThingData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/thing?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
