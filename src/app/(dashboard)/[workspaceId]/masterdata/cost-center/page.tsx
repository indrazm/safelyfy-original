import { apiUrlServer } from "@/lib/constant/apiUrl"
import { CostCenter } from "@/components/App/MainApp/Masterdata/CostCenter"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const costCenterData = await getCostCenterData(workspaceId)
    const locationsData = await getLocationData(workspaceId)
    const groupsData = await getGroupData(workspaceId)

    return <CostCenter costCentersData={costCenterData} locationsData={locationsData} groupsData={groupsData} />
}

async function getCostCenterData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/cost-center?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}

async function getLocationData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/location?workspaceId=${workspaceId}`, {
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
