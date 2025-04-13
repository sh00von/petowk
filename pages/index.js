"use client"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Button } from "../components/ui/button";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // NEW

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Head>
        <title>PETOWK - Login</title>
      </Head>
      <Helmet>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
      </Helmet>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="./logo.png" 
                alt="PETOWK" 
                className="h-16 w-32 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to PETOWK</h1>
            <p className="text-gray-600 mb-8">AI-powered pet care assistant</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={async () => {
                setLoading(true);
                const result = await signIn("petowk", { callbackUrl: "/dashboard" });
                if (!result?.ok) {
                  setLoading(false);
                  console.error("Sign in failed or was canceled", result);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition duration-300 ease-in-out text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Signing in..." : "Sign in with PETOWK"}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-6">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} PETOWK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
