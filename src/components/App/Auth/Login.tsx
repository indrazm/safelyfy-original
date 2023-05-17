"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export const Login = () => {
    const router = useRouter()
    const setLoading = useSetRecoilState(loadingState)
    const [loginData, setLoginData] = React.useState({
        email: "",
        password: "",
    })

    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmitLogin = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        const { email, password } = loginData
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setLoading(false)
            toast.error(error.message)
            console.log({ error })
            return
        }
        setLoading(false)
        const workspace = await supabase.from("profiles").select("workspace").eq("id", data?.user?.id).single()
        router.push(workspace.data?.workspace)
        toast.success("Login Successfully")
    }

    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <h1>Login</h1>
            <p></p>
            <form onSubmit={handleSubmitLogin}>
                <div className="space-y-4">
                    <Input label="Email" id="email" placeholder="email@acme.com" onChange={handleEventChange} />
                    <Input type="password" label="Password" id="password" placeholder="your-secret-password" onChange={handleEventChange} />
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
