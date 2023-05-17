import { atom } from "recoil"

export const inspectionDataState = atom<inspectionDataProps>({
    key: "inspectionDataState",
    default: {
        id: "",
        inspectionNumber: "",
        inspectionDate: new Date(Date.now()),
        expiryDate: null,
        findings: "",
        operator: "",
        timesheet: "",
        certificateNumber: "",
        certificateReceiver: "",
        invoice: null,
        inspector: null,
        status: null,
        submittedBy: "",
    },
})

export interface inspectionDataProps {
    id?: string
    inspectionNumber: string
    inspectionDate: Date | null | string
    expiryDate: Date | null | string
    findings?: string
    operator?: string
    timesheet?: string
    certificateNumber?: string
    certificateReceiver?: string
    invoice: selectableProps | null
    invoiceNumber?: { invoiceNumber: string }
    inspector?: selectableProps | null
    status?: selectableProps | null
    submittedBy?: string
}
