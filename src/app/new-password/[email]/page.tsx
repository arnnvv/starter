import { getCurrentSession, resetPasswordAction } from "@/actions";
import { AuthFormComponent } from "@/components/AuthFormComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { JSX } from "react";

export default async function Page(props: {
  params: Promise<{
    email: string;
  }>;
}): Promise<JSX.Element> {
  const params = await props.params;
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/");
  const emailBAD = params.email;
  const email = decodeURIComponent(emailBAD);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-black">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a new password for {email}
          </p>
        </div>
        <AuthFormComponent
          action={resetPasswordAction}
          onSuccessRedirect="/login"
        >
          <input type="hidden" name="email" value={email} />
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                placeholder="Confirm New Password"
              />
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </AuthFormComponent>
      </div>
    </div>
  );
}
