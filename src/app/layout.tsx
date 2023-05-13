import "../styles/globals.css"
import { Inter } from "next/font/google"
import { Provider } from "@/components/shared/Provider"
import { childrenProps } from "@/types/childrenProp"
import { SiteConfig } from "@/config/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: SiteConfig.title,
    description: SiteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
}

export default function RootLayout({ children }: childrenProps) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider>{children}</Provider>
            </body>
        </html>
    )
}
