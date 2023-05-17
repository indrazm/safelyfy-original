import { atom } from "recoil"
import moment from "moment"
export const inspectionDataState = atom<inspectionDataProps>({
    key: "inspectionDataState",
    default: {
        id: "",
        inspectionNumber: "",
        inspectionDate: moment(new Date(Date.now())).format("yyyy-MM-DD"),
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
