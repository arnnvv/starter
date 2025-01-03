import { getCurrentSession } from "@/actions";
import { OTPInput } from "@/components/OTPInput";
import { redirect } from "next/navigation";
import { JSX } from "react";

export default async function OTPPage(): Promise<JSX.Element> {
  const { user } = await getCurrentSession();
  if (!user) return redirect("/signup");
  if (user.verified) return redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Enter OTP</h1>
        <OTPInput userEmail={user?.email} />
      </div>
    </div>
  );
}
