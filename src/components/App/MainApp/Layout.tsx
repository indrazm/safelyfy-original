"use client"

import * as React from "react"
import { useSetRecoilState } from "recoil"
import { workspaceIdState } from "@/lib/recoil/globals"
import { usePathname } from "next/navigation"
import Link from "next/link"
import * as Popover from "@radix-ui/react-popover"
import { Card } from "@/components/shared/ui/ card"
import { Toaster } from "react-hot-toast"

export const AppLayout = ({ children }: childrenProps) => {
    const currentPath = usePathname()
    const currentWorkspace = currentPath.split("/")[1]
    const setWorkspaceId = useSetRecoilState(workspaceIdState)

    React.useEffect(() => {
        setWorkspaceId(currentWorkspace)
    }, [currentWorkspace])

    return (
        <div className="min-h-screen space-y-12 ">
            <div className="flex justify-between items-center border-b-1 p-4">
                <div className="flex gap-8 items-center">
                    <div>Safelyfy.</div>
                    <ul className="flex gap-4">
                        <li className="menu">Dashboard</li>
                        <Link href={`/${currentWorkspace}/thing`}>
                            <li className="menu">Things</li>
                        </Link>
                        <li className="menu">Inspection</li>
                        <li className="menu">Invoice</li>
                        <li>
                            <Popover.Root>
                                <Popover.Trigger className="menu">Master data</Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content sideOffset={5}>
                                        <Card className="ml-10 p-4 bg-white">
                                            <ul className="text-left flex flex-col gap-2 w-fit">
                                                <Link href={`/${currentWorkspace}/masterdata/categories`}>
                                                    <li className="menu text-left">Categories</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/manufacturer`}>
                                                    <li className="menu text-left">Manufacturer</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/cost-center`}>
                                                    <li className="menu text-left">Cost center</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/location`}>
                                                    <li className="menu text-left">Location</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/group`}>
                                                    <li className="menu text-left">Group</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/department`}>
                                                    <li className="menu text-left">Department</li>
                                                </Link>
                                            </ul>
                                        </Card>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </li>
                    </ul>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-indigo-500 text-white w-8 h-8 text-xs font-bold rounded-full flex justify-center items-center">IN</div>
                </div>
            </div>
            <div className="px-8">{children}</div>
            <Toaster toastOptions={{ position: "top-right", duration: 3000 }} />
        </div>
    )
}
