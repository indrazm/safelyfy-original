import { apiUrlServer } from "@/lib/constant/apiUrl"
import { Group } from "@/components/App/MainApp/Masterdata/Group"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const groupsData = await getGroupData(workspaceId)

    return <Group groupsData={groupsData} />
}

async function getGroupData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/group?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
