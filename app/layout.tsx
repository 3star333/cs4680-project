import './globals.css'
import React from 'react'

export const metadata = {
  title: 'StadiumOW Comp Builder',
  description: 'Build the perfect Overwatch composition with custom powers and items',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
