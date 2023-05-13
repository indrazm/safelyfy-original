"use client"

import * as React from "react"
import { useSetRecoilState } from "recoil"
import { workspaceIdState } from "@/lib/recoil/globals"
import { usePathname } from "next/navigation"

export const AppLayout = ({ children }: childrenProps) => {
    const currentPath = usePathname()
    const currentWorkspace = currentPath.split("/")[1]
    const setWorkspaceId = useSetRecoilState(workspaceIdState)

    React.useEffect(() => {
        setWorkspaceId(currentWorkspace)
    }, [currentWorkspace])

    return (
        <div className="min-h-screen space-y-12 mb-20">
            <div className="flex justify-between items-center border-b-1 p-4">
                <div className="flex gap-8 items-center">
                    <div>Safelyfy.</div>
                    <ul className="flex gap-4">
                        <li className="menu">Dashboard</li>
                        <li className="menu">Things</li>
                        <li className="menu">Inspection</li>
                        <li className="menu">Invoice</li>
                        <li className="menu">Master data</li>
                    </ul>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-indigo-500 text-white w-8 h-8 text-xs font-bold rounded-full flex justify-center items-center">
                        IN
                    </div>
                </div>
            </div>
            <div className="px-8">{children}</div>
        </div>
    )
}
