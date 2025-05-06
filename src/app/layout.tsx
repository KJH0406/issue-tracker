import ToastProvider from "@/components/ToastProvider"
import "./globals.css"

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
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
