import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
    accessToken?: string;
    provider?: string;
  }

  interface JWT {
    userId?: string;
    accessToken?: string;
    provider?: string;
  }
} 