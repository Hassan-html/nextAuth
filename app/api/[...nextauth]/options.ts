import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/app/api/dbconfigs/mongose";
import User from "@/app/api/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { email, password } = credentials;
        console.log("This is from credentials: " + credentials);
        await connectMongo();
        // validation
        try {
          const user = await User.findOne({ email: email });
          console.log("This is the user found: " + user);

          if (!user) {
            throw new Error("No such user exists");
          } else if (!user.isVerified) {
            throw new Error("User is not verified. Wait for admin approval");
          } else {
            const passwordMatch = password == user.password;
            if (passwordMatch) {
              console.log("This is the user returned: " + user);
              return user;
            } else {
              throw new Error("Password incorrect");
            }
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    // modifying token
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAdmin = user.isAdmin;
        token.email = user.email;
        token.exp = Math.floor(Date.now() / 1000) + 10 * 60 * 60; // 30 days expiry
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id?.toString(),
          isVerified: token.isVerified,
          username: token.username,
          isAdmin: token.isAdmin,
          email: token.email,
        };
        session.exp = token.exp as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/pages/public/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
