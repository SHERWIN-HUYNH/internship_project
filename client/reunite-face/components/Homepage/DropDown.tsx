'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import ClickOutside from '@/components/ClickOutside'
import { signOut, useSession } from 'next-auth/react'
import { BookPlus, CreditCard, LogOut, SquareUser } from 'lucide-react'
import { useAuth } from '@/context/authContext'
const Dropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
   const { user, loading } = useAuth()
   useEffect(() => {
     console.log(dropdownOpen)
   },[dropdownOpen])
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setDropdownOpen(!dropdownOpen)
    }}
        className="flex items-center gap-4"
        
      >
        <span className="hidden text-right lg:block">
          <span className="block text-md font-semibold rounded-3xl border px-4 py-2 text-primary border-primary hover:bg-primary hover:text-white transition-all ease-in-out duration-300">
            {user?.name}
          </span>
        </span>
      </Link>

      {/* Dropdown Start */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-62.5 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col border-b border-stroke dark:border-strokedark w-full">
            <li className="w-full px-6 py-2">
              Xin chào{' '}
              <span className="font-semibold text-primary">{user?.name}</span>
            </li>
            <hr className="border-slate-200" />
            
            <li className="w-full">
              <Link
                href={`/account/${user?.email}`}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:bg-slate-100 hover:text-primary dark:hover:bg-strokedark lg:text-base w-full px-6 py-2"
              >
                <SquareUser className="h-5 w-5" />
                Thông tin của tôi
              </Link>
            </li>
          </ul>
          <button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: '/login',
              })
            }
            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:bg-slate-100 hover:text-primary dark:hover:bg-strokedark lg:text-base w-full px-6 py-2"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      )}
  
    </ClickOutside>
  )
}

export default Dropdown
