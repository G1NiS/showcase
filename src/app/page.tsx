import Navbar from '@/components/nav/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import ValueProps from '@/components/sections/ValueProps'
import Services from '@/components/sections/Services'
import TechStack from '@/components/sections/TechStack'
import Portfolio from '@/components/sections/Portfolio'
import Process from '@/components/sections/Process'
import WhyMe from '@/components/sections/WhyMe'
import CtaSection from '@/components/sections/CtaSection'
import Footer from '@/components/footer/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ValueProps />
        <Services />
        <TechStack />
        <Portfolio />
        <Process />
        <WhyMe />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
