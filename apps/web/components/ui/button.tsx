import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-border bg-background shadow-xs hover:bg-secondary hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(10,115,255,0.35)] hover:bg-[var(--brand-hover)] hover:shadow-[0_6px_20px_rgba(10,115,255,0.45)] hover:-translate-y-0.5",
        brandSoft:
          "bg-[var(--brand-soft)] text-[var(--brand)] hover:bg-[#e1efff] hover:-translate-y-0.5",
        gradient:
          "bg-gradient-to-r from-[var(--brand)] via-[oklch(0.55_0.2_290)] to-[oklch(0.55_0.18_165)] text-white shadow-lg animate-gradient hover:shadow-xl hover:-translate-y-0.5",
        glow: "bg-foreground text-background shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        shine:
          "bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(10,115,255,0.35)] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full hover:bg-[var(--brand-hover)]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-lg gap-1.5 px-3.5 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-7 text-base has-[>svg]:px-5",
        xl: "h-14 rounded-xl px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
