import { apiUrlServer } from "@/lib/constant/apiUrl"
import { InspectionView } from "@/components/App/MainApp/Inspection/InspectionView"

export default async function Page({ params }: { params: { inspectionId: string } }) {
    const { inspectionId } = params
    const inspectionData = await getInspectionData(inspectionId)

    return <InspectionView inspectionData={inspectionData} />
}

async function getInspectionData(inspectionId: string) {
    const response = await fetch(`${apiUrlServer}/v1/inspections?inspectionId=${inspectionId}`, {
        cache: "no-cache",
    })
    const { data } = await response.json()
    return data
}
