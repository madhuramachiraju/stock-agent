import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

// Check if OAuth credentials are configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const isAppleConfigured = process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET;

const providers = [];

// Only add providers if credentials are configured
if (isGoogleConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  );
}

if (isAppleConfigured) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    })
  );
}

// If no providers are configured, add a warning
if (providers.length === 0) {
  console.warn(`
    ⚠️  OAuth credentials not configured!
    
    To enable Google and Apple sign-in:
    
    1. Create a .env.local file in your project root
    2. Add your OAuth credentials:
    
    # Google OAuth
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    
    # Apple Sign-In
    APPLE_CLIENT_ID=your-apple-service-id
    APPLE_CLIENT_SECRET=your-generated-jwt-token
    
    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your-random-secret-key
    
    See OAUTH_SETUP.md for detailed setup instructions.
  `);
}

const handler = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.userId = user.id;
      }
      // Ensure userId is always available
      if (token.sub && !token.userId) {
        token.userId = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.userId as string) || token.sub!;
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 