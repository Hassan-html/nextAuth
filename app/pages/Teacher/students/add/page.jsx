import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

const page = () => {
  return (
    <>
      <section>
        <Link href="/pages/Teacher/students">
          <button className="bg-black text-white px-4 py-2 m-10">
            <FaArrowLeft className="text-white text-[30px]" />
          </button>
        </Link>
      </section>
      <section></section>
    </>
  );
};

export default page;
