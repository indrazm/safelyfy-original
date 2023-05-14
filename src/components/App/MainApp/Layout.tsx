"use client"
import { Header } from "./Header"
import * as React from "react"
import { Toaster } from "react-hot-toast"

export const AppLayout = ({ children }: childrenProps) => {
    return (
        <div className="min-h-screen space-y-12 relative">
            <Header />
            <div className="px-8">{children}</div>
            <Toaster toastOptions={{ position: "top-right", duration: 3000 }} />
        </div>
    )
}
