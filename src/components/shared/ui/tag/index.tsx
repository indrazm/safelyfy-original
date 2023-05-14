import * as React from "react"
import { tv } from "tailwind-variants"
import { twMerge } from "tailwind-merge"

const tagVariants = tv({
    base: "w-fit text-[10px] px-2 py-1 text-center font-bold rounded-full transition duration-200 ease-in-out space-y-8",
    variants: {
        variant: {
            valid: "bg-emerald-100 text-emerald-600 border-emerald-500 border-1",
            danger: "bg-red-100 text-red-600 border-red-500 border-1",
            warning: "bg-yellow-100 text-yellow-600 border-yellow-500 border-1",
            gray: "bg-gray-100 text-gray-600 border-gray-500 border-1",
        },
    },
    defaultVariants: {
        variant: "gray",
    },
})

interface tagProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "valid" | "danger" | "warning" | "gray"
    className?: string
}

const Tag = ({ variant, className, ...props }: tagProps) => {
    return <div className={twMerge(tagVariants({ variant }), className)}>{props.children}</div>
}

Tag.displayName = Tag
export { Tag }
