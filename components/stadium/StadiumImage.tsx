"use client"
import React, { useMemo, useState } from 'react'

function normalizeBasic(name: string) {
  // Replace smart quotes and apostrophes with underscore, spaces to underscore, remove problematic chars
  return name
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035'`]/g, '_')
    .replace(/[\u201C\u201D\u201E\u2033\u2036\"]/g, '_')
    .replace(/\s+/g, '_')
}

function stripDiacritics(name: string) {
  try {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  } catch { return name }
}

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export default function StadiumImage({ filename, alt, className, basePath = '/stadium/', placeholderClassName }: {
  filename?: string
  alt: string
  className?: string
  basePath?: string
  placeholderClassName?: string
}) {
  const variants = useMemo(() => {
    if (!filename) return [] as string[]
    const raw = filename
    const v: string[] = []
    const push = (s?: string) => { if (s && !v.includes(s)) v.push(s) }
    push(raw)
    push(normalizeBasic(raw))
    push(sanitize(normalizeBasic(raw)))
    const noDia = stripDiacritics(raw)
    if (noDia !== raw) {
      push(noDia)
      push(normalizeBasic(noDia))
      push(sanitize(normalizeBasic(noDia)))
    }
    // URI-encoded forms
    push(encodeURI(raw))
    push(encodeURI(normalizeBasic(raw)))
    push(encodeURI(sanitize(normalizeBasic(raw))))
    if (noDia !== raw) {
      push(encodeURI(noDia))
      push(encodeURI(normalizeBasic(noDia)))
      push(encodeURI(sanitize(normalizeBasic(noDia))))
    }
    return v
  }, [filename])

  const [idx, setIdx] = useState(0)
  const current = variants[idx]

  if (!current) {
    return <div className={placeholderClassName || className?.replace(/(w-\S+|h-\S+)/g, '') || 'bg-gray-100'} />
  }

  return (
    <img
      src={`${basePath}${current}`}
      alt={alt}
      className={className}
      onError={() => {
        if (idx < variants.length - 1) setIdx(idx + 1)
      }}
    />
  )
}
