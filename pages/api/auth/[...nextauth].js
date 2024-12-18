import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; // MongoDB client promise

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),  // Connect NextAuth with MongoDB
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET, // For JWT signing
  callbacks: {
    async session({ session, user }) {
      // You can include additional custom session data here.
      session.user.id = user.id; // Store the MongoDB user ID in the session
      return session;
    },
    async signIn({ user, account, profile }) {
      // You can perform custom logic here (e.g., save user data to MongoDB).
      return true; // Continue the sign-in process
    },
  },
});
