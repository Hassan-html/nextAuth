import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthProvider from "@/app/AuthProvider";
import Header from "@/app/components/teachercomponents/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CCPD Student managment system",
  description: "managment system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
         {session && <Header/>}
          
          {children}
          </AuthProvider>
      </body>
    </html>
  );
}
