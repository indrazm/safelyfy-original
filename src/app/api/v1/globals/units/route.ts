import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
    const { data, error } = await supabase.from("units").select("*").order("created_at", { ascending: true })
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST() {
    return NextResponse.json({ message: "Currently not supported" })
}
