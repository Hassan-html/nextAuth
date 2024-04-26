"use client";
import { Table } from "flowbite-react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Link href="/pages/Teacher/students/add">
        <button className="bg-black text-white px-4 py-2 m-10">
          Add Student
        </button>
      </Link>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head className="bg-primary text-white">
            <Table.HeadCell className="bg-primary text-white">
              Students
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white">
              Time
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white">
              Category
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white">
              Price
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default page;
