import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = process.env.ADMIN_USERNAME;
        const pass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === user &&
          credentials?.password === pass
        ) {
          return {
            id: "1",
            name: user ?? "Admin"
          };
        }
        return null;
      }
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};