"use client"

import { Button } from "@/components/shared/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <main className="flex justify-center items-center h-screen">
            <div className="w-[400px] space-y-4 text-center">
                <h2 className="text-center">Safelyfy is all-on-one tool to manage equipments and inspection, and we are currently in alpha version</h2>
                <div>
                    <Link href="/login">
                        <Button auto>Login here</Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
