import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase
        .from("master-costcenter")
        .select("id,name,description,location(id,name),group(name,description)")
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
    const { description, name, location, group, workspaceId } = await body
    const { data, error } = await supabase.from("master-costcenter").insert([{ name, description, location, group, workspaceId }]).select().single()

    return NextResponse.json({ data, error })
}

export async function PUT(req: NextRequest) {
    const body = await req.json()
    const { id, description, name, location, group } = await body
    const { data, error } = await supabase.from("master-costcenter").update({ description, name, location, group }).eq("id", id).select().single()

    return NextResponse.json({ data, error })
}

export async function DELETE(req: NextRequest) {
    const deleteId = req.nextUrl.searchParams.get("deleteId")
    const { data, error } = await supabase.from("master-costcenter").update({ deleted: true }).eq("id", deleteId).select().single()

    return NextResponse.json({ data, error })
}
