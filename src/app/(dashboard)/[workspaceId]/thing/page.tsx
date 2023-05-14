import { apiUrlServer } from "@/lib/constant/apiUrl"
import { Thing } from "@/components/App/MainApp/Thing"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const thingsData = await getThingData(workspaceId)
    const costCentersData = await getCostCenterData(workspaceId)
    const categoriesData = await getCategoriesData(workspaceId)
    const manufacturersData = await getManufacturerData(workspaceId)
    const capacityUnitsData = await getCapacityUnitsData()
    const statusData = await getStatusData()
    const schedulesData = await getSchedulesData()

    return (
        <Thing
            thingsData={thingsData}
            costCentersData={costCentersData}
            categoriesData={categoriesData}
            manufacturersData={manufacturersData}
            capacityUnitsData={capacityUnitsData}
            schedulesData={schedulesData}
            statusData={statusData}
        />
    )
}

async function getThingData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/thing?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
async function getCostCenterData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/cost-center?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: selectableProps) => {
        return { value: item.id, label: item.name }
    })
    return modifiedData
}
async function getCategoriesData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/categories?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
async function getManufacturerData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/masterdata/manufacturer?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: selectableProps) => {
        return { value: item.id, label: item.name }
    })
    return modifiedData
}
async function getCapacityUnitsData() {
    const response = await fetch(`${apiUrlServer}/v1/globals/units`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: selectableProps) => {
        return { value: item.id, label: item.name }
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
async function getSchedulesData() {
    const response = await fetch(`${apiUrlServer}/v1/globals/schedules`, {
        cache: "no-cache",
    })
    const data = await response.json()
    const modifiedData = await data.map((item: selectableProps) => {
        return { value: item.id, label: item.name }
    })
    return modifiedData
}
