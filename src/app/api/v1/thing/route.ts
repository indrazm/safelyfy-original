import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const { data, error } = await supabase
        .from("things")
        .select(
            "id,idNumber,serialNumber,description,category(name),yearManufacture,model,capacity,capacityUnit(name,symbol),schedule(name),status(id,name,color),remarks,manufacturer(name),parentThingId(idNumber),submittedBy(id,full_name,avatar_url),expiryDate,inspectionDate,costCenter(name,location)"
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
    const {
        idNumber,
        serialNumber,
        description,
        category,
        yearManufacture,
        model,
        capacity1,
        capacity2,
        capacity3,
        capacityUnit,
        schedule,
        status,
        remarks,
        manufacturer,
        parentId,
        submittedBy,
        expiryDate,
        inspectionDate,
        costCenter,
        workspaceId,
    } = await body
    const { data, error } = await supabase
        .from("things")
        .insert([
            {
                idNumber,
                serialNumber,
                description,
                category,
                yearManufacture,
                model,
                capacity: {
                    capacity1: Number(capacity1),
                    capacity2: Number(capacity2),
                    capacity3: Number(capacity3),
                },
                capacityUnit,
                schedule,
                status,
                remarks,
                manufacturer,
                parentThingId: parentId,
                submittedBy,
                expiryDate,
                inspectionDate,
                costCenter,
                workspaceId,
            },
        ])
        .select()
        .single()

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
