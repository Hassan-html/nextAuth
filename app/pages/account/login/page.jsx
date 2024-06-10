/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";

import { useState } from "react";

export default function page() {
  const [body, setBody] = useState();
  const handelSubmit = async (e) => {
    e.preventDefault();
    const { email, psw } = body;
    if ((email, psw)) {
      const user = await signIn("credentials", { email, psw, redirect: false })
        .then((res) => {
          alert("Loged in press ok to login pannel");
        })
        .catch((err) => {
          alert("An Error Occurd while login try refresing the page");
        });
    } else {
      alert("please fill all the fields");
    }
  };
  return (
    <section className="flex w-full h-screen justify-center items-center flex-col">
      <h1 className="font-bold m-[30px] text-[30px] tracking-wider">
        Enter Credentials
      </h1>

      {/* ----------------------- */}
      {/* form */}
      {/* ----------------------- */}

      <form
        className="flex max-w-md flex-col gap-4 w-[300px]"
        onSubmit={handelSubmit}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="email"
            required
            shadow
            onChange={(e) => {
              setBody({ ...body, email: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2" value="Your password" />
          </div>
          <TextInput
            id="password2"
            type="password"
            required
            shadow
            onChange={(e) => {
              setBody({ ...body, psw: e.target.value });
            }}
          />
        </div>

        <Button className="bg-primary" type="submit">
          Log In
        </Button>
      </form>
    </section>
  );
}
