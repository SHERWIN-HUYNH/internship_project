'use client'
import Footer from "@/components/Homepage/Footer"
import Header from "@/components/Homepage/Header"
import Hero from "@/components/Homepage/Hero";
import ListPeople from "@/components/ListPeople";
import SearchFiler from "@/components/SearchFilter";
import { useState } from "react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log('ENV TEST', process.env.NEXT_PUBLIC_FLASK_API_URL)
  return (
    <div className="">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Hero />
      <SearchFiler />
      <ListPeople />
      <Footer />
    </div>
  );
}
