import * as React from "react"
import { tv } from "tailwind-variants"
import { useRecoilValue } from "recoil"
import { loadingState } from "@/lib/recoil/globals"

const inputVariants = tv({
    base: "w-full font-medium bg-gray-100 text-gray-900 shadow shadow-gray-200 placeholder:text-gray-100 border-1 border-gray-300 hover:border-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-600 disabled:bg-gray-200 disabled:text-gray-300 rounded-md transition duration-200 ease-in-out",
    variants: {
        size: {
            small: "text-xs px-4 py-2",
            medium: "text-sm px-4 py-2 ",
            large: "text-lg px-6 py-3",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "medium",
    },
})

interface inputProps extends React.HTMLAttributes<HTMLInputElement> {
    size?: "small" | "medium" | "large"
    label: string
}

const Input = ({ size, label, ...props }: inputProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            <label htmlFor={props.id} className="block text-gray-500 font-medium">
                {label}
            </label>
            <input disabled={loading} className={inputVariants({ size, label })} {...props} />
        </div>
    )
}

Input.displayName = Input
export { Input }
