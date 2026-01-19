import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

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
          logger.warn("Login attempt with missing credentials");
          throw new Error("Invalid credentials");
        }

        logger.info("Login attempt", { email: credentials.email });

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          logger.warn("Login failed: user not found", { email: credentials.email });
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          logger.warn("Login failed: incorrect password", { 
            email: credentials.email,
            userId: user.id 
          });
          throw new Error("Invalid credentials");
        }

        logger.info("User logged in successfully", { 
          userId: user.id, 
          email: user.email 
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Fetch user role from database only when first creating the token
        // The role will persist in the token and won't be fetched again on subsequent calls
        if (token.role === undefined) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true }
            });
            token.role = dbUser?.role || 'user';
          } catch (error) {
            logger.error("Error fetching user role for JWT", error as Error);
            // Default to 'user' role if database query fails
            token.role = 'user';
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

// Helper function to create a new user
export async function createUser(email: string, password: string, name: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    logger.warn("User creation failed: email already exists", { email });
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  
  logger.info("User created in database", { userId: user.id, email: user.email });
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
