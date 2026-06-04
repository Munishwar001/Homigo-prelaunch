import { Navbar, Footer }                                          from "@/components/layout";
import { Hero, Problem, HowItWorks, Services, WhyHomigo, Waitlist } from "@/components/sections";
import { AiChatWidget }                                            from "@/components/ui";

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
      <AiChatWidget />
    </>
  );
}
