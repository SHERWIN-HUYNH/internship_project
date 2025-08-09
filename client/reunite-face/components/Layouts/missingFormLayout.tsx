'use client'

import React from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'


const MissingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <Header />
          <main className='flex items-center justify-center bg-primary'>
            <div className="body-width ">{children}</div>
          </main>
        <Footer />
    </div>
  )
}

export default MissingLayout
