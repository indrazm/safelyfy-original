"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"

export const ForgotPassword = () => {
    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <div className="space-y-1">
                <h2>Reset password</h2>
                <p>Fill with your remembered email, if you don&lsquo;t please contact us</p>
            </div>
            <form>
                <div className="space-y-4">
                    <Input label="Email" id="email" placeholder="email@acme.com" />
                    <Button>Reset password</Button>
                </div>
            </form>
            <div className="flex gap-1 text-center justify-center text-xs text-gray-400 font-normal">
                <strong>Privacy Policy</strong> and <strong>Terms</strong> of Service apply.
            </div>
        </Card>
    )
}
