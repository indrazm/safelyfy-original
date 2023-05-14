"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"

export const Onboarding = () => {
    const [mode, setMode] = React.useState<"create" | "join">("create")

    const CreateMode = () => {
        return (
            <Card className="w-[380px] m-auto" variant="ghost">
                <div className="space-y-1 text-center">
                    <h2>Setup workspace</h2>
                    <p>You will need a workspace for your organization, once.</p>
                </div>
                <form>
                    <div className="space-y-4">
                        <Input label="Workspace / Organization name" id="workspaceName" placeholder="workspace-name" />
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
                <form>
                    <div className="space-y-4">
                        <Input label="Workspace / Organization key" id="workspaceName" placeholder="workspace-xxxxxx" />
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
