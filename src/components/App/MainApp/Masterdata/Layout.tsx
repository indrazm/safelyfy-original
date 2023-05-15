"use client"

import * as React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { workspaceIdState } from "@/lib/recoil/globals"
import Link from "next/link"
import { modeState } from "@/lib/recoil/masterdata"
export const MasterdataLayout = ({ children }: childrenProps) => {
    const workspaceId = useRecoilValue(workspaceIdState)
    const setMode = useSetRecoilState(modeState)

    return (
        <div className="max-w-5xl m-auto flex gap-8">
            <ul className="hidden xl:block w-[220px] space-y-5 border-r-1">
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/categories`} onClick={() => setMode("view")}>
                        Categories
                    </Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/cost-center`} onClick={() => setMode("view")}>
                        Cost center
                    </Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/manufacturer`} onClick={() => setMode("view")}>
                        Manufacturer
                    </Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/location`} onClick={() => setMode("view")}>
                        Location
                    </Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/group`} onClick={() => setMode("view")}>
                        Group
                    </Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/department`} onClick={() => setMode("view")}>
                        Department
                    </Link>
                </li>
            </ul>
            <div className="w-full xl:w-[calc(100%-220px)]">{children}</div>
        </div>
    )
}
