"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  JSX,
  type ReactNode,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ActionResult } from "./AuthFormComponent";
import { Spinner } from "./ui/spinner";
import { isFormControl } from "@/lib/form-control";

export const ForgotPasswordFormComponent = ({
  children,
  action,
}: {
  children: ReactNode;
  action: (_: any, formdata: FormData) => Promise<ActionResult>;
}): JSX.Element => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, setFormState] = useState<ActionResult>({
    success: false,
    message: "",
  });

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await action(null, formData);
        setFormState(result);

        if (result.success) {
          toast.success(result.message, {
            id: "success-toast",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("success-toast"),
            },
          });
          const email = formData.get("email") as string;
          router.push(`/forgot2/${email}`);
        } else if (result.message) {
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
    <form action={handleSubmit}>
      {disabledChildren}
      {isPending && <Spinner />}
    </form>
  );
};
