'use client'

import { useState, useRef, useEffect } from 'react';
import { Cat, ArrowDownCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Email from '../components/Email';
import Hero from '../components/Hero';
import Head from 'next/head';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect after login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Head>
        <title>PetOWK</title>
        <link rel="icon" href="/pet.png" />
      </Head>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
        <section className="max-w-md mx-auto mt-8 p-6 border-2 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b-2 border-red-300 focus:border-red-500 focus:ring-0 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Enter a password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b-2 border-red-300 focus:border-red-500 focus:ring-0 shadow-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 rounded-[30px] py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Or</p>
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 rounded-[30px] py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login with Google'}
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              New user?{' '}
              <Link href="/signup">
                <span className="text-red-600 hover:text-red-700 font-medium">
                  Sign up here
                </span>
              </Link>
            </p>
          </div>
        </section>
        <Email />
      </main>
      <Footer />
    </div>
  );
}
