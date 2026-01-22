import * as React from "react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Simplified resizable components that work without the problematic imports
function ResizablePanelGroup({
  className,
  children,
  direction = "horizontal",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { direction?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="resizable-panel-group"
      data-panel-group-direction={direction}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" && "flex-col",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizablePanel({
  className,
  children,
  defaultSize = 50,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { defaultSize?: number }) {
  return (
    <div 
      data-slot="resizable-panel" 
      className={cn("flex-1", className)}
      style={{ flexBasis: `${defaultSize}%` }}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean
}) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        "bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </div>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }