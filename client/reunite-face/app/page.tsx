import Footer from "@/components/Homepage/Footer"
import Header from "@/components/Homepage/Header"
import Hero from "@/components/Homepage/Hero";
import ListPeople from "@/components/ListPeople";

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <ListPeople />
      <Footer />
    </div>
  );
}
