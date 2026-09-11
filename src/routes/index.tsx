import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import PartiesStrip from "@/components/site/PartiesStrip";
import Speciality from "@/components/site/Speciality";
import Dishes from "@/components/site/Dishes";
import VideoBanner from "@/components/site/VideoBanner";
import Gallery from "@/components/site/Gallery";
import Reserve from "@/components/site/Reserve";
import Footer from "@/components/site/Footer";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOGO — Luxury Catering & Memorable Events" },
      { name: "description", content: "Premium catering and event styling by LOGO. Weddings, corporate, and social events crafted with refined hospitality since 2011." },
      { property: "og:title", content: "LOGO — Luxury Catering & Memorable Events" },
      { property: "og:description", content: "Premium catering and event styling by LOGO." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-cream text-brown-deep overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <PartiesStrip />
      <Speciality />
      <Dishes />
      <VideoBanner />
      <Gallery />
      <Reserve />
      <Footer />
    </main>
  );
}
