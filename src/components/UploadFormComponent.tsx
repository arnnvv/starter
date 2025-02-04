"use client";

import {
  Children,
  cloneElement,
  type FormEvent,
  isValidElement,
  type JSX,
  type ReactNode,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { isFormControl } from "@/lib/form-control";

export type ActionResult = {
  success: boolean;
  errorOrUrl: string;
};

type UploadFormProps = {
  children: ReactNode;
  action: (formdata: FormData) => Promise<ActionResult>;
};

export const UploadFormComponent = ({
  children,
  action,
}: UploadFormProps): JSX.Element => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, setFormState] = useState<ActionResult>({
    success: false,
    errorOrUrl: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await action(formData);
        setFormState(result);

        if (result.success) {
          toast.success("Uploaded", {
            id: "success-toast",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("success-toast"),
            },
          });
        } else {
          toast.error(result.errorOrUrl, {
            id: "error-toast",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("error-toast"),
            },
          });
        }

        router.refresh();
      } catch {
        toast.error("An unexpected error occurred", {
          id: "error-toast",
          action: {
            label: "Close",
            onClick: () => toast.dismiss("error-toast"),
          },
        });
        router.refresh();
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
    <form onSubmit={handleSubmit}>
      {disabledChildren}
      {isPending && <Spinner />}
    </form>
  );
};
