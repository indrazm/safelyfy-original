"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import Link from "next/link"

export const Signup = () => {
    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <h1>Signup</h1>
            <p></p>
            <form>
                <div className="space-y-4">
                    <Input label="Full name" id="fullName" placeholder="Full name" />
                    <Input label="Username" id="username" placeholder="Username" />
                    <Input label="Email" id="email" placeholder="Email" />
                    <Input type="password" label="Password" id="password" placeholder="Enter 6 characters password or more..." />
                    <Button>Sign up</Button>
                </div>
            </form>
            <ul className="text-center">
                <li>
                    Have an account?{" "}
                    <Link href="/login" className="link">
                        Login
                    </Link>
                </li>
            </ul>
            <div className="flex gap-1 text-center justify-center text-xs text-gray-400 font-normal">
                <strong>Privacy Policy</strong> and <strong>Terms</strong> of Service apply.
            </div>
        </Card>
    )
}
