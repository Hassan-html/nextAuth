import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    email?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      username?: string;
      type?: string;
      email?: string;
    } & DefaultSession["user"];
    exp?: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    username?: string;

    type?: string;
    email?: string;
  }
}
