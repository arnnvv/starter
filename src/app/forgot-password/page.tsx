import { forgotPasswordAction, getCurrentSession } from "@/actions";
import { ForgotPasswordFormComponent } from "@/components/ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { JSX } from "react";

export default async function Page(): Promise<JSX.Element> {
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-black">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <ForgotPasswordFormComponent action={forgotPasswordAction}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                placeholder="example@example.com"
                required
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Send Reset Link
              </Button>
            </div>
          </div>
        </ForgotPasswordFormComponent>
        <div className="text-center mt-4">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
