import React from 'react'

export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring ${props.className || ''}`}
    >
      {children}
    </button>
  )
}
