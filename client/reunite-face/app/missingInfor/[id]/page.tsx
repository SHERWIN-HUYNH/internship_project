'use client'
import { useParams } from "next/navigation"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Image from 'next/image'
import { useEffect, useState } from "react"
import MissingInforLayout from "@/components/Layouts/missingInforLayout"
import router from "next/router"
import { ArrowBigLeft } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/Homepage/Footer"
import { PostAdmin } from "@/test/interface"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/helper/formatDate"


const PersonInfor = () => {
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post,setPost] = useState<PostAdmin>()
  const [relatedPosts,setRelatedPosts] = useState<PostAdmin[]>([])
  const handleThumbnailClick = (idx: number) => {
    setImages((prev) => {
      const next = [...prev]
      // swap ảnh lớn (0) với thumbnail (idx)
      ;[next[0], next[idx]] = [next[idx], next[0]]
      return next
    })
  }
  useEffect(() => {
    const fetchSimilarPosts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/posts/similar/${id}`)
        const data = await response.json()
        setRelatedPosts(data.related_posts)
      } catch (error) {
        console.error('Error fetching similar posts:', error)
      } finally{
        setIsLoading(false)
      }
    }
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/posts/${id}`)
        const data = await response.json()
        setPost(data.post)
        console.log('POST',data)

      } catch (error) {
        console.error('Error fetching similar posts:', error)
      } finally{
        setIsLoading(false)
      }
    }
    fetchPost()
    fetchSimilarPosts()
  },[])
    return (
      <div>
        <MissingInforLayout>
            <div className=" rounded-md flex items-center justify-center min-h-screen ">
                  <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 md:left-10 flex items-center text-gray-600 hover:text-indigo-700 transition-colors z-10"
                  >
                    <ArrowBigLeft />
                    <Link href={'/'} className="font-medium">Back to Home</Link>
        
                  </button>
                  {/* center and constrain width */}
                  <div className="w-full max-w-screen-xl px-4 py-8 lg:py-16">
                    <div className="grid lg:grid-cols-12 lg:gap-8">
                      
                      {/* IMAGE SECTION */}
                      <div className="lg:col-span-7  w-fit rounded-md">
                        <div className="relative w-full h-[480px]">
                          <Image
                            src={`/api/image/${post?.images[0]}`}
                            alt="Main person"
                            width={400}
                            height={480}
                            
                            className="block object-fill w-full h-full rounded-md"
                          />
                        </div>
                       <div className="flex items-center justify-between space-x-2 mt-4">
                            {post?.images.slice(1).map((src, i: number) => (
                              <div
                                key={i}
                                onClick={() => handleThumbnailClick(i + 1)} // Index starts from 1
                                className="relative w-[140px] h-[150px] cursor-pointer"
                              >
                                <Image
                                  src={`/api/image/${src}`} // Use the image path directly
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
                        <h1 className="text-4xl font-semibold text-primary">{post?.name ? post.name : 'Missing Person'}</h1>
                        <div className=" bg-secondaryPriamry text-white px-3 py-1 rounded-full text-lg flex justify-center">
                          <p>{post?.status ? post.status : 'Finding'}</p>
                        </div>
                        
                        <ul className="space-y-2 text-xl">
                          <li><strong>Gender:</strong>{post?.gender}</li>
                          <li><strong>Date of birth:</strong> {formatDate(post?.dob as string)}</li>
                          <li><strong>Missing since:</strong> {formatDate(post?.missing_since as string) ? formatDate(post?.missing_since as string) : post?.missing_since}</li>
                          <li><strong>Description:</strong>{post?.description}</li>
                        </ul>
                        
                        <div className="border-t pt-4 space-y-2 text-xl">
                          <h2 className="text-lg font-medium">Contact</h2>
                          <p><strong>Poster:</strong> {post?.account.name}</p>
                          <p><strong>Contact infor:</strong> {post?.contact_info}</p>
                          
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
        </MissingInforLayout>
        {/* BLOCK 2 */}
        <div className="w-full bg-slate-100 mb-5 items-center flex flex-col gap-2 py-12">
      <h2 className="font-bold text-4xl mb-12 text-center">
        <span className="text-primary">Related posts</span>
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="w-[1200px] custom-swiper">
          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={24}
            slidesPerView={4}
            className="!static py-8"
          >
            {relatedPosts.map((post) => (
              <SwiperSlide key={post.post_id} className="h-full py-8">
                <div className="w-[280px] h-full bg-white border border-slate-200 rounded-lg p-4 cursor-pointer shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col">
                  <div className="w-full h-[200px] overflow-hidden rounded-lg flex-shrink-0">
                    <Image
                      src={`/api/image/${post.images[0]}` || '/assets/images/missing_people/person1.png'}
                      alt={` ${post.name}`}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-block text-[13px] p-1 rounded-full px-2 bg-primary text-white w-fit">
                          {post.name}
                        </span>
                        
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-semibold text-base line-clamp-1">
                          {post.name}
                        </h2>
                        <h2 className="text-sm line-clamp-1">
                          Missing person: {post.address}
                        </h2>
                        <h2 className="text-sm">
                          Gender: {post.gender ? 'Nam' : 'Nữ'}
                        </h2>
                        <h2 className="text-sm line-clamp-1">
                          Description: {post.description}
                        </h2>
                      </div>
                    </div>
                    <Link
                      href={{
                        pathname: `/missingInfor/${post.post_id}`,
                        
                      }}
                      // onClick={(e) => handleDoctorClick(e, post.facultyId, post.id)}
                    >
                      <Button className="mt-4 p-2.5 bg-transparent border border-primary text-primary rounded-full w-full text-center text-sm hover:bg-primary hover:text-white transition-all duration-300">
                        Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
        <Footer/>
      </div>
        

    )
}

export default PersonInfor

function setImages(arg0: (prev: any) => any[]) {
  throw new Error("Function not implemented.")
}
