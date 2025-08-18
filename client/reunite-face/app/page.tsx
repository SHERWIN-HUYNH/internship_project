'use client'
import Footer from "@/components/Homepage/Footer"
import Header from "@/components/Homepage/Header"
import Hero from "@/components/Homepage/Hero";
import ListPeople from "@/components/ListPeople";
import { MainSearch } from "@/components/MainSearch";
import SearchFiler from "@/components/SearchFilter";
import { useState } from "react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Hero />
      <MainSearch />
      <Footer />
    </div>
  );
}
