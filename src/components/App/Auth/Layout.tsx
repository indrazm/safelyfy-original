"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"

export const AuthLayout = ({ children }: childrenProps) => {
    return (
        <div className="relative flex w-full h-screen justify-center items-center">
            <div className="absolute top-8 left-8 cursor-pointer flex gap-2 items-center">
                <ArrowLeft size={14} />
                Back to home
            </div>
            <div>{children}</div>
        </div>
    )
}
