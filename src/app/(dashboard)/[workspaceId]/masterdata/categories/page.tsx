import { Categories } from "@/components/App/MainApp/Masterdata/Categories"

export default async function Page({ params }: { params: { workspaceId: string } }) {
    const { workspaceId } = params
    const categoriesData = await getCategories(workspaceId)

    return <Categories categoriesData={categoriesData} />
}

async function getCategories(workspaceId: string) {
    const response = await fetch(`http://localhost:3000/api/v1/masterdata/categories?workspaceId=${workspaceId}`, {
        cache: "no-cache",
    })
    const data = await response.json()
    return data
}
