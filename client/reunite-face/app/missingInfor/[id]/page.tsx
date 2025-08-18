'use client'
import MissingLayout from "@/components/Layouts/missingFormLayout"
import { defaultConfig } from "next/dist/server/config-shared"
import { useParams } from "next/navigation"
import Image from 'next/image'
import { useState } from "react"

const initialImages = [
  '/assets/images/missing_people/person1.png',
  '/assets/images/missing_people/person2.png',
  '/assets/images/missing_people/person3.png',
  '/assets/images/missing_people/person4.png',
  '/assets/images/missing_people/person5.png',

]
const PersonInfor = () => {
    const params = useParams()
    const [images, setImages] = useState<string[]>(initialImages)

  const handleThumbnailClick = (idx: number) => {
    setImages((prev) => {
      const next = [...prev]
      // swap ảnh lớn (0) với thumbnail (idx)
      ;[next[0], next[idx]] = [next[idx], next[0]]
      return next
    })
  }
    return (
        <MissingLayout>
             <div className=" rounded-md flex items-center justify-center min-h-screen bg-gray-50">
      
                  {/* center and constrain width */}
                  <div className="w-full max-w-screen-xl px-4 py-8 lg:py-16">
                    
                    <div className="grid lg:grid-cols-12 lg:gap-8">
                      
                      {/* IMAGE SECTION */}
                      <div className="lg:col-span-7  w-fit rounded-md">
                        <div className="relative w-full h-[480px]">
                          <Image
                            src={images[0]}
                            alt="Main person"
                            width={400}
                            height={480}
                            
                            className="block object-fill w-full h-full rounded-md"
                          />
                        </div>
                        <div className="flex items-center justify-between space-x-2 mt-4">
                          {images.slice(1).map((src, i) => (
                            <div
                              key={i}
                              onClick={() => handleThumbnailClick(i + 1)}
                              className="relative w-[140px] h-[150px] cursor-pointer"
                            >
                              <Image
                                src={src}
                                alt={`Thumbnail ${i + 1}`}
                                width={140}
                                height={150}
                                className="block object-fill w-full h-full rounded-md"
                              
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* INFO SECTION */}
                      <div className="lg:col-span-5 mt-8 lg:mt-0 flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-2xl">
                        <h1 className="text-4xl font-semibold text-primary">Nguyễn Thị B</h1>
                        <div className=" bg-secondaryPriamry text-white px-3 py-1 rounded-full text-lg flex justify-center">
                          <p>Finding</p>
                        </div>
                        
                        <ul className="space-y-2 text-xl">
                          <li><strong>Gender:</strong> Nữ</li>
                          <li><strong>Date of birth:</strong> 15/08/1990</li>
                          <li><strong>Missing since:</strong> 01/08/2025</li>
                          <li><strong>Description:</strong> Cao 1m70, nặng 60kg, mặc áo trắng…</li>
                        </ul>
                        
                        <div className="border-t pt-4 space-y-2 text-xl">
                          <h2 className="text-lg font-medium">Contact</h2>
                          <p><strong>Poster:</strong> Trần Thị Bích</p>
                          <p><strong>Contact infor:</strong> 0909 xxxx</p>
                          
                          <div className="flex space-x-4">
                            <button className="flex-1 bg-secondaryPriamry text-white py-2 rounded hover:bg-primary">
                              Call
                            </button>
                            <button className="flex-1 border border-secondaryPriamry text-secondaryPriamry py-2 rounded hover:bg-primary/50">
                              Text
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* INFO SECTION END */}
        </div>
      </div>
    </div>
        </MissingLayout>
    )
}

export default PersonInfor