
"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"

interface GiantImageProps extends Omit<ImageProps, "onError"> {
  fallbackText: string
  containerClassName?: string
}

export function GiantImage({ src, alt, fallbackText, containerClassName, className, ...props }: GiantImageProps) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [src])

  if (!src || imgError) {
    return (
      <div className={`flex items-center justify-center bg-muted text-amber-100 font-serif font-bold ${containerClassName}`}>
        {fallbackText}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
      {...props}
    />
  )
}
