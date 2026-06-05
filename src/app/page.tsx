import { Navbar, Footer }                                          from "@/components/layout";
import { Hero, Problem, HowItWorks, Services, WhyHomizy, Waitlist } from "@/components/sections";
import { AiChatWidget, WaitlistPopup }                             from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Services />
        <WhyHomizy />
        <Waitlist />
      </main>
      <Footer />
      <AiChatWidget />
      <WaitlistPopup />
    </>
  );
}
