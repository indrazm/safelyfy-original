import { atom } from "recoil"

export const loadingState = atom({
    key: "loadingState",
    default: false,
})

export const workspaceIdState = atom({
    key: "workspaceId",
    default: "",
})
