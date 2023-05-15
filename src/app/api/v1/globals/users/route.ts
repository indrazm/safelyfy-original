import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase.from("profiles").select("id,full_name,avatar_url").eq("workspace", workspaceId)
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST() {
    return NextResponse.json({ message: "Currently not supported" })
}
