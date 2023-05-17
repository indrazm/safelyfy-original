"use client"

import * as React from "react"
import { RecoilRoot } from "recoil"
import { TailwindScreenSize } from "./TailwindScreenSize"
import { Toaster } from "react-hot-toast"

const isDevEnv = process.env.NEXT_PUBLIC_ENV_MODE

export const Provider = ({ children }: childrenProps) => {
    return (
        <RecoilRoot>
            {children}
            {isDevEnv === "development" && <TailwindScreenSize />}
            <Toaster toastOptions={{ position: "top-right", duration: 3000 }} />
        </RecoilRoot>
    )
}
