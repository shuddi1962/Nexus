"use client"

import { forwardRef } from "react"
import { HexColorPicker } from "react-colorful"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ color, onChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <HexColorPicker color={color} onChange={onChange} />
      </div>
    )
  }
)

ColorPicker.displayName = "ColorPicker"