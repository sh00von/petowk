"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "../components/ui/button";

import Hero from "../components/Hero";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePetowkLogin = async () => {
    try {
      await signIn("petowk", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Petowk sign in failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Head>
        <title>PETOWK - AI-powered pet care assistant</title>
      </Head>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
        {!session ? (
        <section className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-2xl shadow-lg bg-white">
          <p className="text-center text-gray-600 mb-6">Sign in to access your personalized pet care dashboard</p>

          <div className="space-y-4">
            <Button
              onClick={handlePetowkLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] flex items-center justify-center"
            >
              <span className="text-lg font-medium">Sign in with PETOWK</span>
            </Button>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-2">Don't have an account?</p>
              <a
                href="https://site.petowk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
              >
                Create an account on PETOWK
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-2xl shadow-lg bg-white text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome back, {session.user?.name || "User"}!</h2>
          <p className="mb-6 text-gray-600">You're already signed in to your PETOWK account.</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 px-8 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            <span className="text-lg font-medium">Go to Dashboard</span>
          </Button>
        </section>
      )}
      </main>
      <Footer />
    </div>
  );
}
