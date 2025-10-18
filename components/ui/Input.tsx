import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`border rounded px-2 py-1 ${props.className || ''}`} />
}
