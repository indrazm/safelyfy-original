"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import { generateRandomString } from "@/lib/generateRandomString"
import { supabase } from "@/lib/supabase/client"
import { useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export const Onboarding = () => {
    const router = useRouter()
    const randomStr = generateRandomString(7)
    const [mode, setMode] = React.useState<"create" | "join">("create")
    const [workspace, setWorkspace] = React.useState("")

    const setLoading = useSetRecoilState(loadingState)

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkspace(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        if (mode === "create")
            createWorkspace().then((res) => {
                editProfile({ workspaceId: res?.id })
                router.push(`/${res?.id}`)
            })
        else
            checkIfWorkspaceExist().then(() => {
                editProfile({ workspaceId: undefined })
                router.push(`/${workspace}`)
            })
    }

    const createWorkspace = async () => {
        const { data, error } = await supabase
            .from("workspaces")
            .insert([{ id: `${workspace.toLocaleLowerCase()}-${randomStr}`, name: workspace }])
            .select()
            .single()
        if (error) {
            setLoading(false)
            toast.error(error.message)
            return
        }
        toast.success("Workspace has been successfully created, redirecting...")
        setLoading(false)
        return data
    }

    const checkIfWorkspaceExist = async () => {
        const { data, error } = await supabase.from("workspaces").select("id").eq("id", workspace).maybeSingle()
        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }
        if (data) {
            toast.success("Workspace exists")
            setLoading(false)
            return data
        }
        toast.success("Workspace available")
        setLoading(false)
    }

    const editProfile = async ({ workspaceId }: { workspaceId?: string }) => {
        const user = await supabase.auth.getUser()
        const userId = user.data.user?.id
        const { error } = await supabase
            .from("profiles")
            .update({ workspace: workspaceId ? workspaceId : workspace })
            .eq("id", userId)
            .select()
            .single()
        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }
        toast.success("Joined successfully")
        setLoading(false)
    }

    const CreateMode = () => {
        return (
            <Card className="w-[380px] m-auto" variant="ghost">
                <div className="space-y-1 text-center">
                    <h2>Setup workspace</h2>
                    <p>You will need a workspace for your organization, once.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input label="Workspace / Organization name" id="workspaceName" placeholder="workspace-name" onChange={handleEventChange} />
                        <Button>Create workspace</Button>
                    </div>
                </form>
                <div className="link w-full flex justify-center" onClick={() => setMode("join")}>
                    Join my organization
                </div>
            </Card>
        )
    }

    const JoinMode = () => {
        return (
            <Card className="w-[380px] m-auto" variant="ghost">
                <div className="space-y-1 text-center">
                    <h2>Join workspace</h2>
                    <p>You will need a workspace for your organization, once.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input label="Workspace / Organization key" id="workspaceName" placeholder="workspace-xxxxxx" onChange={handleEventChange} />
                        <Button>Join workspace</Button>
                    </div>
                </form>
                <div className="link w-full flex justify-center" onClick={() => setMode("create")}>
                    Create my organization
                </div>
            </Card>
        )
    }

    return mode === "create" ? CreateMode() : JoinMode()
}
