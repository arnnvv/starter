"use client";

import { Root } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ComponentRef, forwardRef, JSX } from "react";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const Label = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof labelVariants>
>(
  ({ className, ...props }, ref): JSX.Element => (
    <Root ref={ref} className={cn(labelVariants(), className)} {...props} />
  ),
);
Label.displayName = Root.displayName;
