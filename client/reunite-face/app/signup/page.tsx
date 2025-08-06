import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { RegisterForm } from '@/components/forms/RegisterForm'

const SignUp = () => {
  return (
    <div className="flex h-screen max-h-screen bg-primary">
      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-[496px] bg-white p-10 rounded-xl">
          <RegisterForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              Reunite Face
            </p>
            <Link href="/register" className="text-green-500">
              Đăng ký
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/familyReunion.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  )
}

export default SignUp
