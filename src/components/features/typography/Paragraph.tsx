import { cn } from "@mr/lib/utils";
import { ComponentProps, FunctionComponent } from "react";

export const Paragraph: FunctionComponent<ComponentProps<"p">> = ({ children, className, ...props }) => {
  return (
    <p className={cn("leading-6 [&:not(:first-child)]:mt-4", className)} {...props}>
      {children}
    </p>
  );
};
