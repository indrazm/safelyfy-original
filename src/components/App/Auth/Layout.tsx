"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const AuthLayout = ({ children }: childrenProps) => {
    return (
        <div className="relative flex w-full h-screen justify-center items-center">
            <Link href="/">
                <div className="absolute top-8 left-8 cursor-pointer flex gap-2 items-center">
                    <ArrowLeft size={14} />
                    Back to home
                </div>
            </Link>
            <div>{children}</div>
        </div>
    )
}
