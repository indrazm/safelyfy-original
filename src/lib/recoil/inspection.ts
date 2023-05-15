import { atom } from "recoil"

export const inspectionDataState = atom<inspectionDataProps>({
    key: "inspectionDataState",
    default: {
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
    inspectionDate: Date | null | string
    expiryDate: Date | null | string
    findings?: string
    operator?: string
    timesheet?: string
    certificateNumber?: string
    certificateReceiver?: string
    invoice: selectableProps | null
    inspector?: selectableProps | null
    status?: selectableProps | null
    submittedBy?: string
}
