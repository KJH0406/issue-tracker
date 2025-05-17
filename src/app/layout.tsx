import type { Metadata } from "next"
import "./globals.css"
import ToastProvider from "@/components/ToastProvider"

export const metadata: Metadata = {
  title: "Issue Tracker",
  description: "Issue Tracker",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
