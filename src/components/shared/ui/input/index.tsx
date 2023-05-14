import * as React from "react"
import { tv } from "tailwind-variants"
import { useRecoilValue } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import Select from "react-select"

const inputVariants = tv({
    base: "w-full font-medium bg-white text-gray-900 shadow shadow-gray-200 placeholder:text-gray-300 placeholder:font-normal border-1 border-gray-300 hover:border-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-600 disabled:bg-gray-200 disabled:text-gray-300 rounded-md transition duration-200 ease-in-out",
    variants: {
        size: {
            small: "text-xs px-2 py-2",
            medium: "text-sm px-3 py-3",
            large: "text-lg px-4 py-3",
        },
    },
    defaultVariants: {
        size: "medium",
    },
})

const textAreaVariants = tv({
    base: "w-full p-3 font-medium bg-white text-gray-900 shadow shadow-gray-200 placeholder:text-gray-300 placeholder:font-normal border-1 border-gray-300 hover:border-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-600 disabled:bg-gray-200 disabled:text-gray-300 rounded-md transition duration-200 ease-in-out",
})

type NativeInput = React.InputHTMLAttributes<HTMLInputElement>
interface inputProps extends Omit<NativeInput, "size"> {
    label?: string
    size?: "medium" | "large" | "small"
}
interface textAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

const Input = ({ size, label, ...props }: inputProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={props.id} className="block text-gray-900 font-medium">
                    {label}
                </label>
            )}
            <input disabled={loading} className={inputVariants({ size })} {...props} />
        </div>
    )
}

const TextArea = ({ label, ...props }: textAreaProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={props.id} className="block text-gray-900 font-medium">
                    {label}
                </label>
            )}
            <textarea rows={4} disabled={loading} className={textAreaVariants()} {...props} />
        </div>
    )
}

interface SelectableProps {
    label?: string
    value?: any
    options: Array<
        | { label: string; value: string }
        | { label: string; value: number }
        | { label: string; value: boolean }
        | { label: string; value: string | number }
        | { label: string; value: string | boolean }
        | { label: string; value: string | number | boolean }
    >
    // eslint-disable-next-line no-unused-vars
    onChange: (e: selectableProps) => void
}

const Selectable = ({ value, options, label, onChange }: SelectableProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            {label && <label className="block text-gray-900 font-medium">{label}</label>}
            <Select
                isDisabled={loading}
                isClearable
                isSearchable
                value={value}
                onChange={onChange}
                options={options}
                className="shadow shadow-gray-200 text-gray-900 disabled:text-gray-200"
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        background: state.isDisabled ? "#e5e7eb" : "#fff",
                        // color: state.isDisabled ? "#d1d5db" : "#111827",
                        WebkitBoxShadow: state.isFocused ? "0px 0px 0px 4px #c7d2fe" : "none",
                        borderColor: state.isFocused ? "#4f46e5" : "#d1d5db",
                        outline: state.isFocused ? "#ff4444" : "none",
                        boxShadow: "none",
                        borderRadius: "0.55em",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                    }),
                }}
            />
        </div>
    )
}

Input.displayName = Input
TextArea.displayName = TextArea
Selectable.displayName = Selectable
export { Input, TextArea, Selectable }
