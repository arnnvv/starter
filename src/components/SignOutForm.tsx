"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  JSX,
  ReactNode,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ActionResult } from "./AuthFormComponent";
import { Spinner } from "./ui/spinner";
import { isFormControl } from "@/lib/form-control";

export const SignOutFormComponent = ({
  children,
  action,
}: {
  children: ReactNode;
  action: () => Promise<ActionResult>;
}): JSX.Element => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const result = await action();

        if (result.success) {
          toast.success(result.message, {
            id: "success-toast",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("success-toast"),
            },
          });
          router.push("/login");
        } else {
          toast.error(result.message, {
            id: "error-toast",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("error-toast"),
            },
          });
        }
      } catch {
        toast.error("An unexpected error occurred", {
          id: "error-toast",
          action: {
            label: "Close",
            onClick: () => toast.dismiss("error-toast"),
          },
        });
      }
    });
  };

  const disabledChildren = Children.map(children, (child) => {
    if (isValidElement(child) && isFormControl(child)) {
      return cloneElement(child, { disabled: isPending });
    }
    return child;
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {disabledChildren}
      {isPending && <Spinner />}
    </form>
  );
};
