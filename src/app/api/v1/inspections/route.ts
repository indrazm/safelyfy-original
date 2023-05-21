import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const inspectionId = req.nextUrl.searchParams.get("inspectionId")
    const thingId = req.nextUrl.searchParams.get("thingId")

    if (thingId) {
        const { data, error } = await supabase
            .from("inspections")
            .select("*,inspector(full_name,avatar_url),submittedBy(full_name,avatar_url),invoiceNumber(id,invoiceNumber),status(name,color),thingId(idNumber)")
            .eq("thingId", thingId)

        return NextResponse.json({ data, error })
    }

    if (inspectionId) {
        const { data, error } = await supabase
            .from("inspections")
            .select("*,inspector(full_name,avatar_url),submittedBy(full_name,avatar_url),invoiceNumber(id,invoiceNumber),status(name,color),thingId(idNumber)")
            .eq("id", inspectionId)
            .single()

        return NextResponse.json({ data, error })
    }
    const { data, error } = await supabase
        .from("inspections")
        .select("*,inspector(full_name,avatar_url),submittedBy(full_name,avatar_url),invoiceNumber(id,invoiceNumber),status(name,color),thingId(idNumber)")
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
        inspectionNumber,
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
                inspectionNumber,
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
