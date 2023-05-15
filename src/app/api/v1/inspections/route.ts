import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase
        .from("inspections")
        .select("*,status(id,name),inspector(full_name,avatar_url),submittedBy(full_name,avatar_url)invoiceNumber(invoiceNumber)")
        .eq("workspaceId", workspaceId)
        .order("created_at", { ascending: true })
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        timesheet,
        thingId,
        inspectionDate,
        expiryDate,
        findings,
        operator,
        status,
        certificateNumber,
        certificateReceiver,
        invoiceNumber,
        inspector,
        submittedBy,
        workspaceId,
    } = await body
    const { data, error } = await supabase
        .from("inspections")
        .insert([
            {
                timesheet,
                thingId,
                inspectionDate,
                expiryDate,
                findings,
                operator,
                status,
                certificateNumber,
                certificateReceiver,
                invoiceNumber,
                inspector,
                submittedBy,
                workspaceId,
            },
        ])
        .select()
        .single()

    return NextResponse.json({ data, error })
}
