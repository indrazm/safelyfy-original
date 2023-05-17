"use client"
import { Header } from "./Header"
import * as React from "react"

export const AppLayout = ({ children }: childrenProps) => {
    return (
        <div className="min-h-screen space-y-12 relative">
            <Header />
            <div className="px-8">{children}</div>
        </div>
    )
}
