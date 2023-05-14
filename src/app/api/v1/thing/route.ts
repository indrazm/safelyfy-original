import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase
        .from("things")
        .select(
            "id,idNumber,serialNumber,description,category(name),yearManufacture,model,capacity,capacityUnit(name,symbol),schedule(name),status(name,description),remarks,manufacturer(name),parentThingId(idNumber),submittedBy(id,full_name,avatar_url),expiryDate,inspectionDate,costCenter(name,location)"
        )
        .eq("workspaceId", workspaceId)
        .eq("deleted", false)
        .order("created_at", { ascending: true })
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, description, parentId, workspaceId } = await body
    const { data, error } = await supabase.from("master-categories").insert([{ name, description, parentId, workspaceId }]).select().single()

    return NextResponse.json({ data, error })
}

export async function PUT(req: NextRequest) {
    const body = await req.json()
    const { id, name, description, parentId } = await body
    const { data, error } = await supabase.from("master-categories").update({ name, description, parentId }).eq("id", id).select().single()

    return NextResponse.json({ data, error })
}

export async function DELETE(req: NextRequest) {
    const deleteId = req.nextUrl.searchParams.get("deleteId")
    const { data, error } = await supabase.from("master-categories").update({ deleted: true }).eq("id", deleteId).select().single()

    // return NextResponse.json({ data })
    return NextResponse.json({ data, error })
}
