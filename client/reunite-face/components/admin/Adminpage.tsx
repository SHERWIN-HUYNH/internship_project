'use client'
import { StatCard } from '@/components/StatCard'
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { postAdminList } from '@/test/dataPosts'
import { PostAdmin } from '@/test/interface'
import Loading from '../common/Loading'
import { toast } from 'sonner'

const AdminPage = () => {
  const [allPosts, setAllPosts] = useState<PostAdmin[]>([])
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
      
      const fetchAllPosts = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/posts/admin`,{
          method: 'GET',
        })
          if(res.ok){
          const data = await res.json()
          setAllPosts(data.posts)
          console.log('ALL POSTS', data)
        }
        } catch (error:any) {
          toast.error(error)
          console.log('ERROR WHEN CALLING API')
          
        }finally {
        setIsLoading(false); 
      }
    }
    fetchAllPosts()
  }, [])
 
  return (
    <>
    {isLoading && <Loading />}
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
            count={5}
            label="Accounts"
            icon={'/assets/icons/appointments.svg'}
          />
          <StatCard
            type="pending"
            count={10}
            label="Posts"
            icon={'/assets/icons/pending.svg'}
          />
          <StatCard
            type="cancelled"
            count={0}
            label="Missing people found"
            icon={'/assets/icons/cancelled.svg'}
          />
          <StatCard
            type="appointments"
            count={10}
            label="Number of search"
            icon={'/assets/icons/appointments.svg'}
          />
        </section>

        <DataTable
          columns={columns}
          data={ allPosts as any }
        />
      </main>
    </div>
    </>
  )
}

export default AdminPage
