import { atom } from "recoil"

export const categoryDataState = atom<categoryProps>({
    key: "categoryDataState",
    default: {
        id: "",
        name: "",
        description: "",
        parentId: null,
    },
})

export interface categoryProps {
    id?: string
    name: string
    description: string
    parentId?: selectableProps | null
}
