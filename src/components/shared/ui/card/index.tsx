import * as React from "react"
import { tv } from "tailwind-variants"
import { twMerge } from "tailwind-merge"

const cardVariants = tv({
    base: "w-full p-8 font-medium rounded-md transition duration-200 ease-in-out space-y-8",
    variants: {
        variant: {
            bordered: "bg-gray-100 text-gray-900 shadow shadow-gray-200 border-1 border-gray-300",
            ghost: "bg-transparent text-gray-900",
        },
    },
    defaultVariants: {
        variant: "bordered",
    },
})

interface cardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "bordered" | "ghost"
    className?: string
}

const Card = ({ variant, className, ...props }: cardProps) => {
    return <div className={twMerge(cardVariants({ variant }), className)}>{props.children}</div>
}

Card.displayName = Card
export { Card }
