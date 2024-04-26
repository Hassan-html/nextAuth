/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import axios from "axios";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page() {
  const [body, setBody] = useState();
  const router = useRouter();
  const handelSubmit = (e) => {
    e.preventDefault();
    const { email, psw, Cpsw, name, Role } = body;
    if ((email, psw, Cpsw, name, Role)) {
      if (psw === Cpsw) {
        axios
          .post("/api/auth/register", body)
          .then((res) => {
            console.log(res);
            alert(res.data.message);
            router.push("/pages/account/login");
          })
          .catch((err) => {
            console.log(err);
            alert("There was an error please try later");
          });
      } else {
        alert("Password doesnot match");
      }
    } else {
      alert("please fill all the fields");
    }
    console.log(body);
  };
  return (
    <section className="flex w-full h-screen justify-center items-center flex-col">
      <h1 className="font-bold m-[30px] text-[30px] tracking-wider">
        Enter Your Credentials
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
            <Label htmlFor="name" value="Your Name" />
          </div>
          <TextInput
            id="email2"
            type="text"
            placeholder="e.g ali"
            required
            shadow
            onChange={(e) => {
              setBody({ ...body, name: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
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
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password" value="Repeat password" />
          </div>
          <TextInput
            id="repeat-password"
            type="password"
            required
            shadow
            onChange={(e) => {
              setBody({ ...body, Cpsw: e.target.value });
            }}
          />
        </div>
        <select
          onChange={(e) => {
            setBody({ ...body, Role: e.target.value });
          }}
        >
          <option className="p-10" value="">
            select a role
          </option>
          <option className="p-10" value="teacher">
            teacher
          </option>
          <option className="p-10" value="staff">
            staff
          </option>
        </select>

        <Button className="bg-primary" type="submit">
          Register new account
        </Button>
      </form>
    </section>
  );
}
