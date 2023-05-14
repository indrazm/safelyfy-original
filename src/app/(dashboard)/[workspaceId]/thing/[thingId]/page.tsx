import { apiUrlServer } from "@/lib/constant/apiUrl"
import { ThingView } from "@/components/App/MainApp/Thing/ThingView"

export default async function Page({ params }: { params: { thingId: string } }) {
    const { thingId } = params
    const thingData = await getThingData(thingId)

    return <ThingView thingData={thingData} />
}

async function getThingData(thingId: string) {
    const response = await fetch(`${apiUrlServer}/v1/thing?thingId=${thingId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
