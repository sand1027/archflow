import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/schema/user";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Sign Up", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await connectDB();
        
        if (credentials.isSignUp === "true") {
          const existingUser = await User.findOne({ email: credentials.email });
          if (existingUser) throw new Error("User already exists");
          
          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          const user = await User.create({
            email: credentials.email,
            name: credentials.name || "",
            password: hashedPassword,
            provider: "credentials",
          });
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } else {
          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) return null;
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        }
      },
    }),
    ...(process.env.AUTH_GITHUB_ID ? [GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })] : []),
    ...(process.env.AUTH_GOOGLE_ID ? [GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      if (account?.provider === "credentials") return true;
      
      try {
        await connectDB();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || "",
            image: user.image,
            provider: account?.provider as "github" | "google",
            providerId: account?.providerAccountId,
          });
        }
        
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
};