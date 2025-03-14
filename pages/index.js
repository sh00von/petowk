"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

import Hero from "../components/Hero"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Removed the useEffect that redirects to dashboard

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn("email", { email, callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign-in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Head>
        <title>PETOWK - AI-powered pet care assistant</title>
      </Head>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
        {!session ? (
          <section className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Enter your email
                </label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-red-600" disabled={isLoading}>
                {isLoading ? "Sending..." : "Sign Up with Email"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm">Or</p>
              <Button onClick={handleGoogleLogin} className="w-full bg-blue-600" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login with Google"}
              </Button>
            </div>
          </section>
        ) : (
          <section className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {session.user?.name || "User"}!</h2>
            <p className="mb-6">You're already signed in.</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-indigo-600 hover:bg-indigo-700">
              Go to Dashboard
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

