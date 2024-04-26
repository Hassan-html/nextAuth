"use client";

import { Dropdown, Navbar } from "flowbite-react";
import { FaUser } from "react-icons/fa6";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
export default function Header() {
  const { data: user } = useSession();

  useEffect(() => {
    if (user) {
      console.log(user.user);
    }
    console.log(user);
  }, [user]);
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Teacher Pannel
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {!user ? (
          "Wait"
        ) : (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={<FaUser className="text-[30px]" />}
            >
              <Dropdown.Header>
                <span className="block text-sm">{user.email}</span>
                <span className="block truncate text-sm font-medium">
                  {user.Role}
                </span>
              </Dropdown.Header>

              <Dropdown.Divider />
              <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        )}

        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
