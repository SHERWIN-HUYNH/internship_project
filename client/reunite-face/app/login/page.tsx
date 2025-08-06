import Image from 'next/image'
import Link from 'next/link'

import { LoginForm } from '@/components/forms/LoginForm'
import React from 'react'
const Home = () => {
  return (
    <div className="flex h-screen max-h-screen bg-[#f1eff2]">
      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-[496px]">
          <LoginForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/register" className="text-green-500">
              Đăng ký
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/bg_login.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  )
}

export default Home
