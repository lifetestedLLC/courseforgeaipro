import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Temporary in-memory user storage (will be replaced with database)
const users: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
}> = [];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = users.find(u => u.email === credentials.email);

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

// Helper function to create a new user (will be replaced with database)
export async function createUser(email: string, password: string, name: string) {
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password: hashedPassword,
    name,
  };

  users.push(user);
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
