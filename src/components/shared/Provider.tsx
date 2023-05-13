"use client"

import { childrenProps } from "@/types/childrenProp"
import * as React from "react"
import { RecoilRoot } from "recoil"
import { TailwindScreenSize } from "./TailwindScreenSize"

const isDevEnv = process.env.NEXT_PUBLIC_ENV_MODE

export const Provider = ({ children }: childrenProps) => {
    return (
        <RecoilRoot>
            {children}
            {isDevEnv === "development" && <TailwindScreenSize />}
        </RecoilRoot>
    )
}
