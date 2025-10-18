import './globals.css'
import React from 'react'

export const metadata = {
  title: 'StadiumOW Optimizer',
  description: 'Overwatch 2 Stadium Optimizer MVP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">StadiumOW Optimizer</h1>
            <div className="text-sm text-gray-600">MVP — plan generator</div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
