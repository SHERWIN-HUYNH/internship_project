import Footer from "@/components/Homepage/Footer"
import Header from "@/components/Homepage/Header"
import Hero from "@/components/Homepage/Hero";
import ListPeople from "@/components/ListPeople";
import SearchFiler from "@/components/SearchFilter";

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <SearchFiler />
      <ListPeople />
      <Footer />
    </div>
  );
}
