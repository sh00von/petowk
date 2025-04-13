import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    {
      id: "petowk",
      name: "petowk",
      type: "oauth", 
      authorization: { params: { scope: "openid email profile" } },

      authorizationUrl:
      
        "https://site.petowk.com/wp-json/moserver/authorize?response_type=code",
      accessTokenUrl: "	https://site.petowk.com/wp-json/moserver/token",
      userinfoUrl: "https://site.petowk.com/wp-json/moserver/resource",
      // Use the provided discovery endpoint if needed or remove if not used.
      wellKnown:
        "https://site.petowk.com/wp-json/moserver/sgPACOmJGkZrmjqPxoECZeJPYtHFVqaT/.well-known/openid-configuration",
        issuer:"https://site.petowk.com/wp-json/moserver/sgPACOmJGkZrmjqPxoECZeJPYtHFVqaT",
      clientId: "sgPACOmJGkZrmjqPxoECZeJPYtHFVqaT",
      clientSecret: "WhHNFVJzFcCVMMEsQtipFrQxZuhSrYKn",
      async profile(profile, tokens) {
        return {
          id: profile.id || profile.sub,
          name: profile.username || profile.name, // Changed from 'username' to 'name'
          email: profile.email,
        };
      },
    },
  ],
  // Explicitly use JWT sessions
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Save the access token to the JWT token on sign in
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Make the access token available in the session object
      session.accessToken = token.accessToken;
      console.log("session", session);
      return session;
    },
  },
});
