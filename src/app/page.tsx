import { Navbar, Footer }                                          from "@/components/layout";
import { Hero, Problem, HowItWorks, Services, WhyHomigo, Waitlist } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Services />
        <WhyHomigo />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
