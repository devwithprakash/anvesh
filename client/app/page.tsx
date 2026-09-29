import FAQSection from '@/components/landing/FAQSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import Footer from '@/components/landing/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import Navbar from '@/components/landing/Navbar';
import PricingSection from '@/components/landing/PricingSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anvesh',
  description:
    'Anvesh helps you research smarter. Upload PDFs, import websites, and chat with your sources powered by AI.',
  openGraph: {
    title: 'Anvesh – AI-Powered Research Assistant',
    description:
      'Upload documents, import websites, and chat with your sources using the power of AI.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
