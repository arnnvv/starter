"use client";

import { JSX, type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ActionResult } from "./AuthFormComponent";

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

  return (
    <form action={handleSubmit} aria-disabled={isPending}>
      {children}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </form>
  );
};
