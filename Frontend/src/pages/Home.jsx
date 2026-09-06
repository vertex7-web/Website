import Hero from '../components/home/Hero';
import StatsStrip from '../components/home/StatsStrip';
import AboutPreview from '../components/home/AboutPreview';
import ServicesPreview from '../components/home/ServicesPreview';
import MachinesPreview from '../components/home/MachinesPreview';
import FeaturedProjects from '../components/home/FeaturedProjects';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FinalCTA from '../components/home/FinalCTA';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function Home() {
  useDocumentMeta({
    title: 'Vertex 7 | Heavy Equipment Rentals & Construction Supplies',
    description: 'Vertex 7 — Heavy Equipment Rentals & Construction Supplies. Reliable machinery, professional service, and trusted partnerships for your construction projects.',
  });

  return (
    <>
      {/* 1. Hero — Full-width photography */}
      <Hero />

      {/* 2. Trust / Statistics Strip — Dark solid
      <StatsStrip /> */}

      {/* 4. Services Preview — Dark solid (SWAPPED TEMPORARILY)*/}
      <ServicesPreview />
      {/* 3. About Preview — Light / neutral */}
      <AboutPreview />



      {/* 5. Machineries Preview — Black */}
      <MachinesPreview />

      {/* 6. Featured Projects — Light / image cards */}
      <FeaturedProjects />

      {/* 7. Why Choose Us — Charcoal / dark split */}
      <WhyChooseUs />

      {/* 8. Final CTA — Dark with lime accent */}
      <FinalCTA />
    </>
  );
}
