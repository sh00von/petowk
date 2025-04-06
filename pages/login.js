import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If the user is already authenticated, redirect them to the home page.
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div >
      <h1>Login</h1>
      <button 
        onClick={() => signIn("petowk")}
      >
        Sign in with petowk
      </button>
    </div>
  );
}
