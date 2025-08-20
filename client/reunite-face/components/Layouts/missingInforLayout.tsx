'use client'

import React, { useState } from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'


const MissingInforLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
          <main className='flex items-center justify-center bg-primary'>
            <div className="body-width">{children}</div>
          </main>
    </div>
  )
}

export default MissingInforLayout
