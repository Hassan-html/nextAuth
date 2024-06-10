"use client"
import Link from "next/link";
import React,{useState} from "react";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import "flowbite";

const Page = () => {
 
  const [form, setForm] = useState({
    studentName: "",
    guardianName: "",
    contactNumber: "",
    course: "",
    courseDuration: "", // In months
    instructor: "",
    classStartTime: "",
    admissionDate: "",
    admissionFeePaid: false,
    monthlyFeeDates: [],
    feePaymentDates: [], // Track payment dates for each month
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdmissionDateChange = (e) => {
    const { value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      admissionDate: value,
      monthlyFeeDates: generateMonthlyFeeDates(value, prevForm.courseDuration),
      feePaymentDates: generateMonthlyFeeDates(
        value,
        prevForm.courseDuration
      ).map(() => ""), // Initialize fee payment dates
    }));
  };

  const handleCourseDurationChange = (e) => {
    const { value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      courseDuration: value,
      monthlyFeeDates: generateMonthlyFeeDates(prevForm.admissionDate, value),
      feePaymentDates: generateMonthlyFeeDates(
        prevForm.admissionDate,
        value
      ).map(() => ""), // Initialize fee payment dates
    }));
  };

  const generateMonthlyFeeDates = (admissionDate, courseDuration) => {
    if (!admissionDate || !courseDuration) return [];
    const date = new Date(admissionDate);
    const dates = [date.toISOString().split("T")[0]]; // Start with the admission date
    for (let i = 1; i < courseDuration; i++) {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + i);
      dates.push(newDate.toISOString().split("T")[0]);
    }
    
    return dates;
  };

  const handleFeePaymentDateChange = (index, value) => {
    setForm((prevForm) => {
      const newFeePaymentDates = [...prevForm.feePaymentDates];
      newFeePaymentDates[index] = value;
      return {
        ...prevForm,
        feePaymentDates: newFeePaymentDates,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    try {
      await axios.post("/api/students/add", form);
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

 return (
   <>
     <section>
       <Link href="/pages/Teacher/students">
         <button className="bg-black text-white px-4 py-2 m-10">
           <FaArrowLeft className="text-white text-[30px]" />
         </button>
       </Link>
     </section>
     <section>
       <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">Add Student</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Student Name
             </label>
             <input
               type="text"
               name="studentName"
               value={form.studentName}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Guardian Name
             </label>
             <input
               type="text"
               name="guardianName"
               value={form.guardianName}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Contact Number
             </label>
             <input
               type="text"
               name="contactNumber"
               value={form.contactNumber}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Course
             </label>
             <input
               type="text"
               name="course"
               value={form.course}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Course Duration (in months)
             </label>
             <input
               type="number"
               name="courseDuration"
               value={form.courseDuration}
               onChange={handleCourseDurationChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Instructor
             </label>
             <input
               type="text"
               name="instructor"
               value={form.instructor}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Class Start Time
             </label>
             <input
               type="time"
               name="classStartTime"
               value={form.classStartTime}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Admission Date
             </label>
             <input
               type="date"
               name="admissionDate"
               value={form.admissionDate}
               onChange={handleAdmissionDateChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Admission Fee Paid
             </label>
             <input
               type="checkbox"
               name="admissionFeePaid"
               checked={form.admissionFeePaid}
               onChange={handleChange}
               className="mt-1 block"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">
               Monthly Fee Payment Dates
             </label>
             <ul className="list-disc pl-5">
               {form.monthlyFeeDates.map((date, index) => (
                 <li key={index} className="flex items-center space-x-2">
                   <span>{date}</span>
                   <input
                     type="date"
                     value={form.feePaymentDates[index]}
                     onChange={(e) =>
                       handleFeePaymentDateChange(index, e.target.value)
                     }
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                   />
                 </li>
               ))}
             </ul>
           </div>
           <div>
             <button
               type="submit"
               className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
             >
               Add Student
             </button>
           </div>
         </form>
       </div>
     </section>
   </>
 );
};

export default Page;
