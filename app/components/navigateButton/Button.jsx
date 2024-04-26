"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BiKey } from "react-icons/bi";

const Button = () => {
  const navigate = useRouter();
  const handelRoute = () => {
    navigate.push("/pages/account");
  };
  return (
    <button
      className="text-[20px] px-4 py-2 bg-black text-white flex items-center gap-5 hover:bg-opacity-75"
      onClick={handelRoute}
    >
      <BiKey />
      Authenticate
    </button>
  );
};

export default Button;
