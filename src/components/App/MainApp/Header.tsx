"use client"

import * as React from "react"
import Link from "next/link"
import * as Popover from "@radix-ui/react-popover"
import { Card } from "@/components/shared/ui/card"
import { useSetRecoilState } from "recoil"
import { workspaceIdState } from "@/lib/recoil/globals"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { modeState } from "@/lib/recoil/masterdata"
import { supabase } from "@/lib/supabase/client"

export const Header = () => {
    const router = useRouter()
    const currentPath = usePathname()
    const currentWorkspace = currentPath.split("/")[1]
    const setWorkspaceId = useSetRecoilState(workspaceIdState)
    const setMode = useSetRecoilState(modeState)

    React.useEffect(() => {
        setWorkspaceId(currentWorkspace)
    }, [currentWorkspace])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <div className="sticky z-20 top-0 w-full backdrop-blur-md bg-white/5 border-b-1 border-indigo-200/50">
            <div className="flex justify-between items-center  p-4">
                <div className="flex gap-12 items-center">
                    <div className="text-black font-bold">Safelyfy.</div>
                    <ul className="gap-7 hidden sm:flex">
                        <li className="menu">Dashboard</li>
                        <Link href={`/${currentWorkspace}/thing`} onClick={() => setMode("view")}>
                            <li className="menu">Things</li>
                        </Link>
                        <Link href={`/${currentWorkspace}/inspection`} onClick={() => setMode("view")}>
                            <li className="menu">Inspection</li>
                        </Link>
                        <Link href={`/${currentWorkspace}/invoice`} onClick={() => setMode("view")}>
                            <li className="menu">Invoice</li>
                        </Link>
                        <li>
                            <Popover.Root>
                                <Popover.Trigger className="menu">Master data</Popover.Trigger>
                                <Popover.Portal className="z-50">
                                    <Popover.Content sideOffset={20}>
                                        <Card className="ml-10 rounded-t-none p-4 bg-white/10 backdrop-blur-xl">
                                            <ul className="text-left flex flex-col gap-2 w-fit">
                                                <Link href={`/${currentWorkspace}/masterdata/categories`} onClick={() => setMode("view")}>
                                                    <li className="menu text-left">Categories</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/manufacturer`} onClick={() => setMode("view")}>
                                                    <li className="menu text-left">Manufacturer</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/cost-center`} onClick={() => setMode("view")}>
                                                    <li className="menu text-left">Cost center</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/location`} onClick={() => setMode("view")}>
                                                    <li className="menu text-left">Location</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/group`} onClick={() => setMode("view")}>
                                                    <li className="menu text-left">Group</li>
                                                </Link>
                                                <Link href={`/${currentWorkspace}/masterdata/department`} onClick={() => setMode("view")}>
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
                <div className="flex gap-4 items-center relative">
                    <div className="block sm:hidden">
                        <Menu color="#000" />
                    </div>
                    <Popover.Root>
                        <Popover.Trigger className="menu">
                            <div className="bg-indigo-500 text-white w-8 h-8 text-xs font-bold rounded-full flex justify-center items-center">IN</div>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content sideOffset={16} sticky="always">
                                <Card className="mr-12 rounded-t-none p-4 bg-white/10 backdrop-blur-xl">
                                    <ul className="text-left flex flex-col gap-2 w-fit">
                                        <li className="menu text-left" onClick={handleLogout}>
                                            Sign out
                                        </li>
                                    </ul>
                                </Card>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </div>
            </div>
        </div>
    )
}
