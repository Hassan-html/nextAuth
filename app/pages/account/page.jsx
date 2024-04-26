import React from "react";
import Link from "next/link";
const page = () => {
  return (
    <>
      <section className="flex flex-col gap-[30px] justify-center items-center w-full h-screen ">
        <h1 className="text-[40px]">Choose an Action</h1>
        <div className="flex gap-2">
          <Link
            href="/pages/account/login"
            className="px-4 py-2 text-[20px] text-white bg-primary"
          >
            Login
          </Link>
          <Link
            href="/pages/account/register"
            className="px-4 py-2 text-[20px]  border-primary"
          >
            Register
          </Link>
        </div>
      </section>
      <footer className="fixed bottom-2 flex justify-center w-full font-bold uppercase">
        hsn-codes
      </footer>
    </>
  );
};

export default page;
