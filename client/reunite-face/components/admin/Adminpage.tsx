'use client'
import { StatCard } from '@/components/StatCard'
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { appointments } from '@/test/dataAppointment'

const AdminPage = () => {
  useEffect(() => {
   
  }, [])
 
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 p-4 md:p-6 2xl:p-10">
      <header className="admin-header">
        {/* <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/images/logo.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit text-white"
          />
        </Link> */}

        <p className="text-16-semibold dark:text-red text-white">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Start the day with managing new posts</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={50}
            label="Accounts"
            icon={'/assets/icons/appointments.svg'}
          />
          <StatCard
            type="pending"
            count={100}
            label="Posts"
            icon={'/assets/icons/pending.svg'}
          />
          <StatCard
            type="cancelled"
            count={150}
            label="Missing people found"
            icon={'/assets/icons/cancelled.svg'}
          />
          <StatCard
            type="appointments"
            count={50}
            label="Number of search"
            icon={'/assets/icons/appointments.svg'}
          />
        </section>

        <DataTable
          columns={columns}
          data={ appointments as any }
        />
      </main>
    </div>
  )
}

export default AdminPage
