import * as React from "react"
import { tv } from "tailwind-variants"
import { useRecoilValue } from "recoil"
import { loadingState } from "@/lib/recoil/globals"

const buttonVariants = tv({
    base: "w-full font-medium disabled:bg-gray-200 disabled:text-gray-300 rounded-md transition duration-200 ease-in-out",
    variants: {
        variant: {
            primary: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-600 text-white",
            secondary: "bg-transparent border-1 border-gray-400 hover:bg-gray-900 hover:border-gray-900 hover:text-white text-gray-500",
            danger: "bg-red-300 text-black",
            ghost: "bg-transparent text-gray-300",
        },
        size: {
            small: "text-xs px-4 py-2",
            medium: "text-sm px-4 py-3",
            large: "text-lg px-6 py-4",
        },
        auto: {
            true: "w-fit",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "medium",
    },
})

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost"
    size?: "small" | "medium" | "large"
    auto?: boolean
}

const Button = ({ variant, size, auto, ...props }: buttonProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <button disabled={loading} className={buttonVariants({ variant, size, auto })} {...props}>
            {props.children}
        </button>
    )
}

Button.displayName = Button
export { Button }
