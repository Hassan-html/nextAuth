import React from "react";
import Link from "next/link";
const page = () => {
  return (
    <>
      <section className="flex flex-col gap-[30px] justify-center items-center w-full h-screen ">
        <h1 className="text-[40px]">Welcome to CCPD staff pannel</h1>
        <Link
          className="text-[20px] px-4 py-2 bg-black text-white flex items-center gap-5 hover:bg-opacity-75"
          href="/pages/Teacher/students"
        >
          Students
        </Link>
      </section>
      <footer className="fixed bottom-2 flex justify-center w-full font-bold uppercase">
        hsn-codes
      </footer>
    </>
  );
};

export default page;
