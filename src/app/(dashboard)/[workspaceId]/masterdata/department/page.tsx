import { apiUrlServer } from "@/lib/constant/apiUrl"
import { Department } from "@/components/App/MainApp/Masterdata/Department"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const departmentsData = await getDepartmentData(workspaceId)
    const groupsData = await getGroupData(workspaceId)

    return <Department departmentsData={departmentsData} groupsData={groupsData} />
}

async function getDepartmentData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/department?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}

async function getGroupData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/group?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: { id: string; name: string }) => {
        return {
            value: item.id,
            label: item.name,
        }
    })
    return modifiedData
}
