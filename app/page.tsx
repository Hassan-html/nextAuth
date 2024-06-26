import React from "react";
import Button from "@/app/components/navigateButton/Button";
const page = () => {
  return (
    <>
      <section className="flex flex-col gap-[30px] justify-center items-center w-full h-screen ">
        <h1 className="text-[40px]">Welcome to CCPD staff pannel</h1>
        <Button />
      </section>
      <footer className="fixed bottom-2 flex justify-center w-full font-bold uppercase">
        hsn-codes
      </footer>
    </>
  );
};

export default page;
