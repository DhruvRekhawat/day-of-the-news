"use client"

import Image from "next/image"
import { useState } from "react"

interface NewsImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function NewsImage({ src, alt, width, height, className }: NewsImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">{alt}</div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse " />}
      <Image
        src={src || "/placeholder.png"}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover  transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true}
        priority={true}
        crossOrigin="anonymous"
        fill
      />
    </div>
  )
}
