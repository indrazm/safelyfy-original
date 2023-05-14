"use client"

import * as React from "react"
import { useRecoilValue } from "recoil"
import { workspaceIdState } from "@/lib/recoil/globals"
import Link from "next/link"

export const MasterdataLayout = ({ children }: childrenProps) => {
    const workspaceId = useRecoilValue(workspaceIdState)

    return (
        <div className="max-w-5xl m-auto flex gap-8">
            <ul className="hidden xl:block w-[220px] space-y-5 border-r-1">
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/categories`}>Categories</Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/cost-center`}>Cost center</Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/manufacturer`}>Manufacturer</Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/location`}>Location</Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/group`}>Group</Link>
                </li>
                <li className="menu">
                    <Link href={`/${workspaceId}/masterdata/department`}>Department</Link>
                </li>
            </ul>
            <div className="w-full xl:w-[calc(100%-220px)]">{children}</div>
        </div>
    )
}
