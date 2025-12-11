import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "i-eSchool Admin Panel",
  description: "Online school management system - Frontend prototype for technical interviews",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 pl-64">
            <AppHeader />
            <main className="mt-16 p-8">{children}</main>
          </div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
