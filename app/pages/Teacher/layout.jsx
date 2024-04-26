import { Inter } from "next/font/google";
import "./styles/style.css";
import Header from "@/app/components/teachercomponents/header";
const inter = Inter({ subsets: ["latin"] });

export const Metadata = {
  title: "CCPD Student managment system",
  description: "managment system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
