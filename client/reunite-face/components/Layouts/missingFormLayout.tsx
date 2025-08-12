'use client'

import React, { useState } from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'


const MissingLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
          <main className='flex items-center justify-center bg-primary'>
            <div className="body-width">{children}</div>
          </main>
        <Footer />
    </div>
  )
}

export default MissingLayout
