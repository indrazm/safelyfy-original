import { Manufacturer } from "@/components/App/MainApp/Masterdata/Manufacturer"
import { apiUrlServer } from "@/lib/constant/apiUrl"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const manufacturerData = await getManufacturerData(workspaceId)

    return <Manufacturer manufacturersData={manufacturerData} />
}

async function getManufacturerData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/manufacturer?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
