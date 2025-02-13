import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) router.push('/dashboard');
  }, [session, router]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('email', { email, callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign-in failed:', error);
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
        <title>Sign Up - NextAuth</title>
      </Head>
      <Header />
      <main className="flex-grow pt-24">
        <section className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Enter your email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Sign Up with Email'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">Or</p>
            <Button onClick={handleGoogleLogin} className="w-full bg-blue-600" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login with Google'}
            </Button>
            <p className="text-sm mt-4">
              Already registered? <Link href="/auth/signin">Log in here</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
