import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase
        .from("master-manufacturer")
        .select("id,name,description,website")
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
    const { name, description, website, workspaceId } = await body
    const { data, error } = await supabase.from("master-manufacturer").insert([{ name, description, website, workspaceId }]).select().single()

    return NextResponse.json({ data, error })
}

export async function PUT(req: NextRequest) {
    const body = await req.json()
    const { id, name, description, website } = await body
    const { data, error } = await supabase.from("master-manufacturer").update({ name, description, website }).eq("id", id).select().single()

    return NextResponse.json({ data, error })
}

export async function DELETE(req: NextRequest) {
    const deleteId = req.nextUrl.searchParams.get("deleteId")
    const { data, error } = await supabase.from("master-manufacturer").update({ deleted: true }).eq("id", deleteId).select().single()

    // return NextResponse.json({ data })
    return NextResponse.json({ data, error })
}
