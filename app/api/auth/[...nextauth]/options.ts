import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { connect } from "@/app/models/dbconfig/mongoCon";
import { staffModel } from "@/app/models/schemas/TeacherSchema";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { email, psw } = await credentials;
        console.log("Email and password from next auth: " + email + psw);

        await connect();
        const user = await staffModel.findOne({ email: email });
        if (user) {
          if (user.psw === psw) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } else {
          console.log("Not found");
          throw new Error("User not found");
        }
      },
    }),
  ],
  callbacks: {
    // modifiying token
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.Role = user.Role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id?.toString(),
          username: token.username,
          Role: token.Role,
          email: token.email,
        };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/pages/account/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
