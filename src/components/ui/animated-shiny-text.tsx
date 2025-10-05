import { ComponentPropsWithoutRef, CSSProperties, FC } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        // Shine effect
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient - subtle shimmer
        "bg-gradient-to-r from-transparent via-blue-600/30 via-50% to-transparent dark:via-blue-400/30",

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
