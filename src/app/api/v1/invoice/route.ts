import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")
    const invoiceId = req.nextUrl.searchParams.get("invoiceId")

    if (invoiceId) {
        const { data, error } = await supabase
            .from("invoices")
            .select("id,created_at,invoiceNumber,amount,currency(currency,symbol),vatId,lpo,description,company,quantity")
            .eq("id", invoiceId)
            .single()

        if (error) {
            return NextResponse.json(error)
        }
        return NextResponse.json(data)
    }

    const { data, error } = await supabase
        .from("invoices")
        .select("id,created_at,invoiceNumber,amount,currency(currency,symbol),vatId,lpo,description,company,quantity")
        .eq("workspaceId", workspaceId)
        .order("created_at", { ascending: true })
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { invoiceNumber, amount, currency, vatId, lpo, description, remarks, submittedBy, timesheet, company, quantity, workspaceId } = await body
    const { data, error } = await supabase
        .from("invoices")
        .insert([
            {
                invoiceNumber,
                amount,
                currency,
                vatId,
                lpo,
                description,
                remarks,
                submittedBy,
                timesheet,
                company,
                quantity,
                workspaceId,
            },
        ])
        .select()
        .single()

    return NextResponse.json({ data, error })
}
