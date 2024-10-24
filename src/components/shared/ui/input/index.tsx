import * as React from "react"
import { tv } from "tailwind-variants"
import { useRecoilValue } from "recoil"
import { loadingState } from "@/lib/recoil/globals"
import Select, { ActionMeta } from "react-select"
import { twMerge } from "tailwind-merge"
import { useDropzone } from "react-dropzone"
import { FileImage } from "lucide-react"

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
    base: "w-full p-3 font-medium resize-none bg-white text-gray-900 shadow shadow-gray-200 placeholder:text-gray-300 placeholder:font-normal border-1 border-gray-300 hover:border-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-600 disabled:bg-gray-200 disabled:text-gray-300 rounded-md transition duration-200 ease-in-out",
    variants: {
        size: {
            small: "text-xs px-2 py-2",
            medium: "text-sm px-3 py-3",
            large: "text-lg px-4 py-3",
        },
    },
})

type NativeInput = React.InputHTMLAttributes<HTMLInputElement>
type NativeTextArea = React.InputHTMLAttributes<HTMLTextAreaElement>
interface inputProps extends Omit<NativeInput, "size"> {
    label?: string
    size?: "medium" | "large" | "small"
    className?: string
}
interface textAreaProps extends Omit<NativeTextArea, "size"> {
    label?: string
    size?: "medium" | "large" | "small"
}

const Input = ({ size, label, className, ...props }: inputProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={props.id} className="block text-gray-900 font-medium">
                    {label}
                </label>
            )}
            <input disabled={loading} className={twMerge(inputVariants({ size }), className)} {...props} />
        </div>
    )
}

const TextArea = ({ size, label, ...props }: textAreaProps) => {
    const loading = useRecoilValue(loadingState)

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={props.id} className="block text-gray-900 font-medium">
                    {label}
                </label>
            )}
            <textarea rows={4} disabled={loading} className={textAreaVariants({ size })} {...props} />
        </div>
    )
}

import { FileWithPath } from "react-dropzone"

interface MyDropzoneProps {
    label: string
    // eslint-disable-next-line no-unused-vars
    onFilesChange?: (acceptedFiles: FileWithPath[]) => void
}

const FileDropZone = ({ label, onFilesChange }: MyDropzoneProps) => {
    const [, setFiles] = React.useState<FileWithPath[]>([])

    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFiles(acceptedFiles)
            if (onFilesChange) {
                onFilesChange(acceptedFiles)
            }
        },
        [onFilesChange]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div className="space-y-1">
            {label && <label className="block text-gray-900 font-medium">{label}</label>}
            <div
                {...getRootProps()}
                className="w-full py-20 bg-white shadow border-1 border-gray-300 cursor-pointer rounded-lg flex gap-4 text-xs font-medium text-gray-500 justify-center items-center"
            >
                <input {...getInputProps()} />
                <div>
                    <FileImage size={18} strokeWidth={1.5} />
                </div>
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop some files here, or click to select files</p>}
            </div>
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
    onChange: (newValue: any, actionMeta: ActionMeta<any>) => void
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
FileDropZone.displayName = FileDropZone
export { Input, TextArea, Selectable, FileDropZone }
