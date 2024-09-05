import { apiUrlServer } from "@/lib/constant/apiUrl"
import { AllInspection } from "@/components/App/MainApp/Inspection/Inspection"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const inspectionData = await getInspectionData(workspaceId)

    return <AllInspection inspectionData={inspectionData} />
}

async function getInspectionData(workspaceId: string) {
    const response = await fetch(`${apiUrlServer}/v1/inspections?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
