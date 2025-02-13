import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';

export default function SignIn({ providers }) {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          {Object.values(providers).map((provider) => (
            <button key={provider.name} onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}
