"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import Link from "next/link"

export const Login = () => {
    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <h1>Login</h1>
            <p></p>
            <form>
                <div className="space-y-4">
                    <Input label="Email" id="email" placeholder="email@acme.com" />
                    <Input type="password" label="Password" id="password" placeholder="your-secret-password" />
                    <Button>Login</Button>
                </div>
            </form>
            <ul className="text-center space-y-1">
                <li className="link">
                    <Link href="/forgot-password" className="link">
                        Forgot password ?
                    </Link>
                </li>
                <li>
                    Don&lsquo;t have an account?{" "}
                    <Link href="/register" className="link">
                        Register
                    </Link>
                </li>
            </ul>
            <div className="flex gap-1 text-center justify-center text-xs text-gray-400 font-normal">
                <strong>Privacy Policy</strong> and <strong>Terms</strong> of Service apply.
            </div>
        </Card>
    )
}
