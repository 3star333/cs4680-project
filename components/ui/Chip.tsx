import React from 'react'

export default function Chip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-2 py-0.5 bg-gray-200 rounded-full text-sm mr-2 mb-2">
      {children}
    </button>
  )
}
