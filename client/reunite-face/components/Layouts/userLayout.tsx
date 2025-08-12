'use client'

import React, { useState } from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'


const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div>
      <div className="bg-[#e8f2f7] w-full h-min flex flex-col items-center justify-center mt-16 overflow-y-hidden">
        <Header  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <div className="">
          <main>
            <div className="body-width">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default UserLayout
