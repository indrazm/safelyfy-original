import { Categories } from "@/components/App/MainApp/Masterdata/Categories"
const apiUrl = process.env.ENV_MODE === "development" ? "http://localhost:3000" : "https://app.safelyfy.com"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const categoriesData = await getCategories(workspaceId)

    return <Categories categoriesData={categoriesData} />
}

async function getCategories(workspaceId: string) {
    const response = await fetch(`${apiUrl}/v1/masterdata/categories?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
