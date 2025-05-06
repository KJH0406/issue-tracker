import ToastProvider from "@/components/ToastProvider"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "issue-tracker",
  description: "이슈 트래커",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
