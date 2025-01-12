import { getSession } from "@/lib/auth/get-session";
import LoginForm from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
          Entre com a sua conta
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Entre na sua conta para se aproveitar das vantagens dela.
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
