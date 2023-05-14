import { atom } from "recoil"

export const thingDataState = atom<thingProps>({
    key: "thingDataState",
    default: {
        id: "",
        idNumber: "",
        serialNumber: "",
        description: "",
        category: null,
        yearManufacture: "",
        model: "",
        capacity1: 0,
        capacity2: 0,
        capacity3: 0,
        capacityUnit: null,
        schedule: null,
        status: null,
        remarks: "",
        manufacturer: null,
        parentId: null,
        submittedBy: null,
        expiryDate: "",
        inspectionDate: "",
        costCenter: null,
    },
})

export interface thingProps {
    id?: string
    idNumber: string
    serialNumber: string
    description: string
    category: selectableProps | null
    yearManufacture: string
    model: string
    capacity1: number
    capacity2: number
    capacity3: number
    capacity?: {
        capacity1: number
        capacity2: number
        capacity3: number
    }
    capacityUnit: selectableProps | null
    schedule: selectableProps | null
    status: selectableProps | null
    remarks: string
    manufacturer: selectableProps | null
    parentId: selectableProps | null
    submittedBy: selectableProps | null
    expiryDate: string
    inspectionDate: string
    costCenter: selectableProps | null
}
