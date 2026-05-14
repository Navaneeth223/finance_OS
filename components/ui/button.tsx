import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, variant = "default", size = "md", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
          variant === "ghost" && "hover:bg-muted",
          variant === "outline" && "border bg-transparent hover:bg-muted",
          variant === "secondary" && "bg-muted text-foreground hover:bg-muted/80",
          size === "sm" && "h-8 px-3",
          size === "md" && "h-10 px-4",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
