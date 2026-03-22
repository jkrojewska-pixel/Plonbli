import Header from "@/components/Header"
import type { Metadata } from "next"
import "leaflet/dist/leaflet.css"
import "./globals.css"
export const metadata: Metadata = {
  title: "Plonbli",
  description: "Lokalne produkty prosto od rolnika.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}