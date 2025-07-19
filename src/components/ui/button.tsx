import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden will-change-transform ripple-container gpu-accelerated focus-luxury touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glass hover:shadow-elevation transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow/30 modern-button",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-glass hover:shadow-error transform hover:scale-[1.02] active:scale-[0.98] modern-button",
        outline:
          "border-2 border-civic-blue bg-background text-civic-blue hover:bg-civic-blue hover:text-white shadow-glass hover:shadow-elevation transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm modern-button hover-glow",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-glass hover:shadow-elevation transform hover:scale-[1.02] active:scale-[0.98] modern-button",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-subtle transform hover:scale-[1.01] active:scale-[0.99] hover:backdrop-blur-sm modern-button",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transform hover:scale-[1.01] text-shimmer",
        civic: "bg-gradient-civic text-white shadow-elevation hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] modern-button hover:shadow-civic-blue/40 hover-lift",
        glass: "glassmorphism text-civic-blue hover:bg-white/20 shadow-glass hover:shadow-elevation transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md modern-button",
        success: "bg-civic-success text-white hover:bg-civic-success/90 shadow-glass hover:shadow-success transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-civic-success/30 modern-button",
        warning: "bg-civic-warning text-white hover:bg-civic-warning/90 shadow-glass hover:shadow-warning transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-civic-warning/30 modern-button",
        premium: "bg-gradient-premium text-white shadow-elevation hover:shadow-premium transform hover:scale-[1.02] active:scale-[0.98] modern-button hover:shadow-civic-purple/40 hover-lift",
        modern: "bg-gradient-modern text-white shadow-elevation hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] modern-button hover:shadow-civic-teal/40 hover-lift",
        floating: "shadow-fab hover:shadow-glow bg-civic-blue text-white rounded-full transform hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse-glow modern-button",
        neomorphic: "assistant-neomorphic text-civic-blue hover:text-civic-blue-dark transform hover:scale-[1.02] active:scale-[0.98] hover-lift",
        executive: "bg-executive text-white shadow-executive hover:shadow-luxury transform hover:scale-[1.02] active:scale-[0.98] modern-button hover-lift font-bold",
        luxury: "bg-luxury text-white shadow-luxury hover:shadow-executive transform hover:scale-[1.02] active:scale-[0.98] modern-button hover-lift font-bold",
        power: "bg-power text-white shadow-premium hover:shadow-luxury transform hover:scale-[1.02] active:scale-[0.98] modern-button hover-lift font-bold",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px] min-w-[44px]", // Touch-friendly minimum
        sm: "h-8 rounded-md px-3 text-xs min-h-[32px]",
        lg: "h-12 rounded-lg px-8 text-base min-h-[48px]",
        xl: "h-14 rounded-lg px-10 text-lg min-h-[56px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-8 w-8 min-h-[32px] min-w-[32px]",
        "icon-lg": "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
