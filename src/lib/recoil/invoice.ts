import { atom } from "recoil"

export const invoiceDataState = atom<invoiceDataProps>({
    key: "invoiceDataState",
    default: {
        id: "",
        invoiceNumber: "",
        amount: 0,
        currency: null,
        vatId: "",
        lpo: "",
        quantity: 1,
        company: "",
        description: "",
    },
})

export interface invoiceDataProps {
    id?: string
    invoiceNumber: string
    amount: number
    currency: selectableProps | null
    vatId: string
    lpo: string
    quantity: number
    company: string
    description: string
}
