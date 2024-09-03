"use client"

import * as React from "react"
import { Card } from "@/components/shared/ui/card"
import { Input } from "@/components/shared/ui/input"
import { Button } from "@/components/shared/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useSetRecoilState } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import { toast } from "react-hot-toast"

export const ForgotPassword = () => {
    const setLoading = useSetRecoilState(loadingState)
    const [loginData, setLoginData] = React.useState({
        email: "",
    })

    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value,
        })
    }

    const handleResetPassw = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        const { email } = loginData
        const { error } = await supabase.auth.resetPasswordForEmail(
            email, {
                redirectTo: '/login',
            }
        )
        if (error) {
            setLoading(false)
            toast.error(error.message)
            console.log({ error })
            return
        }
        setLoading(false)
    }
    
    return (
        <Card className="w-[380px] m-auto" variant="ghost">
            <div className="space-y-1">
                <h2>Reset password</h2>
                <p>Fill with your remembered email, if you don&lsquo;t please contact us</p>
            </div>
            <form onSubmit={handleResetPassw}>
                <div className="space-y-4">
                    <Input label="Email" id="email" placeholder="email@acme.com" onChange={handleEventChange} />
                    <Button>Reset password</Button>
                </div>
            </form>
            <div className="flex gap-1 text-center justify-center text-xs text-gray-400 font-normal">
                <strong>Privacy Policy</strong> and <strong>Terms</strong> of Service apply.
            </div>
        </Card>
    )
}
