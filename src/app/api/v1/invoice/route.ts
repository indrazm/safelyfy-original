import { NextResponse, NextRequest } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId")

    const { data, error } = await supabase
        .from("invoices")
        .select("id,created_at,invoiceNumber,amount,currency(currency,symbol),vat,lpo,description,remarks,submittedBy,timesheet,company,quantity")
        .eq("workspaceId", workspaceId)
        .order("created_at", { ascending: true })
    if (error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}

export async function POST() {
    return NextResponse.json({ message: "Invoice" })
}
