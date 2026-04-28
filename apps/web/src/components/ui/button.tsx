import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-nexus-blue text-nexus-text-inverse hover:bg-nexus-blue/90 shadow-sm",
      destructive: "bg-nexus-red text-nexus-text-inverse hover:bg-nexus-red/90 shadow-sm",
      outline: "border border-nexus-border bg-nexus-surface hover:bg-nexus-bg-secondary hover:border-nexus-border-strong",
      secondary: "bg-nexus-bg-secondary text-nexus-text-primary hover:bg-nexus-bg-tertiary",
      ghost: "hover:bg-nexus-bg-secondary hover:text-nexus-text-primary",
      link: "text-nexus-blue underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }