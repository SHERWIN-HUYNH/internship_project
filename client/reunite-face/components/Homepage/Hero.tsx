'use client'
import React from 'react'

const Hero = () => {
  // const { data: session } = useSession()
   

  return (
    <section className="bg-secondaryPriamry dark:bg-slate-900 p-15 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Helping Reconnect Missing Persons with Their Families</h1>
                <p className="text-xl mb-8 opacity-90">Our platform assists in locating missing individuals through community reporting, advanced search tools, and nationwide alerts.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-white text-indigo-800 hover:bg-gray-100 font-bold px-6 py-3 rounded-lg transition">
                        Report Missing Person
                    </button>
                    <button className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-800 font-bold px-6 py-3 rounded-lg transition">
                        Learn How to Help
                    </button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
