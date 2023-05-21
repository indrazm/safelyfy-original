import { apiUrlServer } from "@/lib/constant/apiUrl"
import { AllInspection } from "@/components/App/MainApp/Inspection/Inspection"

export default async function Page({ params }: { params: { thingId: string } }) {
    const { thingId } = params
    const inspectionData = await getInspectionData(thingId)

    return <AllInspection inspectionData={inspectionData} />
}

async function getInspectionData(thingId: string) {
    const response = await fetch(`${apiUrlServer}/v1/inspections?thingId=${thingId}`, {
        cache: "no-cache",
    })
    const { data } = await response.json()
    return data
}
