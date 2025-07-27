"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CameraIcon, UploadIcon, XIcon } from "lucide-react"
import { updateUserImage } from "../actions"

interface ProfileImageEditorProps {
  currentImage?: string
  userName: string
}

export function ProfileImageEditor({ currentImage, userName }: ProfileImageEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!previewImage) return

    setIsUploading(true)
    try {
      // In a real app, you'd upload to your storage service
      await updateUserImage(previewImage)

      // Refresh the page to show the new image
      window.location.reload()
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to update image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewImage(null)
    setIsOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="text-lg">{userName.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <CameraIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current/Preview Image */}
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewImage || currentImage} alt={userName} />
                <AvatarFallback className="text-2xl">{userName.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {!previewImage ? (
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full gap-2">
                  <UploadIcon className="h-4 w-4" />
                  Choose New Image
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                    {isUploading ? "Updating..." : "Update"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={isUploading}>
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Maximum file size: 5MB</p>
              <p>• Supported formats: JPG, PNG, GIF</p>
              <p>• Square images work best</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
