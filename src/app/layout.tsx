import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Adrienne Thomas | Portfolio",
    template: "%s | Adrienne Thomas",
  },
  description: "Adrienne Thomas portfolio.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#F3F3F3]">
      <body className="bg-[#F3F3F3]">
        <div className="flex min-h-screen w-full flex-col bg-[#F3F3F3]">
          {children}
        </div>
      </body>
    </html>
  )
}
