"use client"
import React from 'react'
import { signOut } from 'next-auth/react'
const page = () => {
  return (
    <button onClick={()=>{signOut()}}>Sign Out from Staff side</button>
  )
}

export default page