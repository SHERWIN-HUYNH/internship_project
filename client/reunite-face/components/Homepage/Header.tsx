'use client'
import React from 'react'
// import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'


function Header() {
//   const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-slate-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <Image src="/assets/images/logo.png" height={1000}width={1000} alt="logo" className='w-fit'/>
                <h1 className="text-xl font-bold text-black">FindTheMissing</h1>
            </div>
            
            <nav className="hidden md:flex space-x-10">
                <a href="#" className="text-xl text-indigo-800 hover:text-primary font-medium">Home</a>
                <Link href="/missingreport" className="text-xl text-black hover:text-primary">Report missing</Link>
                <a href="#" className="text-xl text-black hover:text-primary">Resources</a>
                <a href="#" className="text-xl text-black hover:text-primary">About</a>
                <a href="#" className="text-xl text-black hover:text-primary">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
                <button className="hidden md:block bg-indigo-700 hover:bg-primary text-white px-5 py-3 rounded-lg transition">
                    <Link href="/login">Đăng nhập</Link>
                </button>
                <button className="md:hidden text-black">
                    <i className="fas fa-bars text-xl"></i>
                </button>
            </div>
        </div>
    </header>
  )
}

export default Header
