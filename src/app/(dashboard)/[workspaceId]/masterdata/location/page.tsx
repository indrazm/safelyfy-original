import { apiUrlServer } from "@/lib/constant/apiUrl"
import { Location } from "@/components/App/MainApp/Masterdata/Location"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const locationsData = await getLocationData(workspaceId)

    return <Location locationsData={locationsData} />
}

async function getLocationData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/location?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
