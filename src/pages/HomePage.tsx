import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

function HomePage() {
  return (
    <>
       <SEO
        title="Accueil"
        description="PNFC - Plateforme Nationale de Formation Congolaise. Découvrez nos formations pour booster votre carrière au Congo-Brazzaville."
        keywords="formation, Congo Brazzaville, PNFC, éducation, carrière, développement professionnel"
        url="/"
        image="/og-home.jpg"
      />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}

export default HomePage;