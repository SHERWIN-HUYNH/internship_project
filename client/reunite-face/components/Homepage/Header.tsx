'use client'
import React, { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import Dropdown from './DropDown'



const  Header = (props: {
  sidebarOpen: string | boolean | undefined
  setSidebarOpen: (arg0: boolean) => void
})=> {
 const [loggedIn, setLoggedIn] = useState<boolean >(false)

  useEffect(() => {
    const cookies = document.cookie
    console.log('COOKIES', cookies)
    if(cookies.includes('access_token')){
        setLoggedIn(true)
    }
  }, [])
  return (
    <header className="sticky top-0 z-50 bg-slate-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link className="flex items-center space-x-2" href={'/'}>
                <Image src="/assets/images/logo.png" height={1000}width={1000} alt="logo" className='w-fit'/>
                <h1 className="text-md font-bold text-black">FindTheMissing</h1>
            </Link>
            
            <nav className="hidden md:flex space-x-10">
                <Link href="/" className="text-md text-indigo-800 hover:text-primary font-medium">Home</Link>
                <Link href="/missingreport" className="text-md text-black hover:text-primary">Report missing</Link>
                <a href="#" className="text-md text-black hover:text-primary">Resources</a>
                <a href="#" className="text-md text-black hover:text-primary">About</a>
                <a href="#" className="text-md text-black hover:text-primary">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
                {!loggedIn ? (
                        <>
                            <button className="hidden md:block bg-indigo-700 hover:bg-primary text-white px-4 py-2 rounded-lg transition">
                                <Link href="/login">Đăng nhập</Link>
                            </button>
                            <button className="hidden md:block bg-white hover:bg-primary hover:text-white text-indigo-700 px-6 py-2 rounded-lg transition">
                                <Link href="/signup">Đăng ký</Link>
                            </button>
                        </>
                ): <Dropdown />}
                
            </div>
        </div>
    </header>
  )
}

export default Header
