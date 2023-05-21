"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import Link from "next/link"
import { useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { supabase } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"

export const Signup = () => {
    const setLoading = useSetRecoilState(loadingState)
    const [signupData, setSignupData] = React.useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
    })

    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData({
            ...signupData,
            [event.target.id]: event.target.value,
        })
    }

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        // remove all the space and special characters
        setSignupData({
            ...signupData,
            username: event.target.value.replace(/\s/g, "").toLowerCase(),
        })
    }

    const handleSubmitSignup = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        const { email, password, fullName, username } = signupData
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username,
                },
            },
        })
        if (error) {
            setLoading(false)
            console.log(error)
            return
        }
        console.log(data)
        setLoading(false)
        toast.success("You have successfully registered, please check your email")
    }

    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <h1>Signup</h1>
            <p></p>
            <form onSubmit={handleSubmitSignup}>
                <div className="space-y-4">
                    <Input label="Full name" id="fullName" placeholder="Full name" value={signupData.fullName || ""} onChange={handleEventChange} />
                    <Input label="Username" id="username" placeholder="Username" value={signupData.username || ""} onChange={handleUsername} />
                    <Input label="Email" id="email" placeholder="Email" value={signupData.email || ""} onChange={handleEventChange} />
                    <Input
                        type="password"
                        label="Password"
                        id="password"
                        value={signupData.password}
                        placeholder="Enter 6 characters password or more..."
                        onChange={handleEventChange}
                    />
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
