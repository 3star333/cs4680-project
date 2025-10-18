import React from 'react'

export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`border rounded px-2 py-1 ${props.className || ''}`} />
}
