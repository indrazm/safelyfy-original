import { atom } from "recoil"

export const modeState = atom<modeProps>({
    key: "modeState",
    default: "view",
})

export const categoryDataState = atom<categoryProps>({
    key: "categoryDataState",
    default: {
        id: "",
        name: "",
        description: "",
        parentId: null,
    },
})

export const manufacturerDataState = atom<manufacturerProps>({
    key: "manufacturerDataState",
    default: {
        id: "",
        name: "",
        description: "",
        website: "",
    },
})

export const costCenterDataState = atom<costCenterProps>({
    key: "costCenterDataState",
    default: {
        id: "",
        name: "",
        email: "",
        description: "",
        location: null,
        group: null,
    },
})

export const locationDataState = atom<locationProps>({
    key: "locationDataState",
    default: {
        id: "",
        name: "",
        description: "",
        company: "",
        gpsLocation: "",
    },
})

export const groupDataState = atom<groupProps>({
    key: "groupDataState",
    default: {
        id: "",
        name: "",
        description: "",
    },
})

export const departmentDataState = atom<departmentProps>({
    key: "departmentDataState",
    default: {
        id: "",
        name: "",
        description: "",
        group: null,
    },
})

type modeProps = "view" | "create" | "edit" | "viewSingle"

export interface categoryProps {
    id?: string
    name: string
    description: string
    parentId?: selectableProps | null
}

export interface manufacturerProps {
    id?: string
    name: string
    description: string
    website?: string
}

export interface costCenterProps {
    id?: string
    name: string
    email: string
    description: string
    location?: selectableProps | null
    group?: selectableProps | null
}

export interface locationProps {
    id?: string
    name: string
    description: string
    company?: string
    gpsLocation?: string
}

export interface groupProps {
    id?: string
    name: string
    description: string
}

export interface departmentProps {
    id?: string
    name: string
    description: string
    group?: selectableProps | null
}
