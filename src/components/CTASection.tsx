import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop')",
        }}
      ></div>
      
      {/* Overlay pour assurer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/75"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Prêt à commencer ?
        </h2>
        <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de jeunes qui transforment leur avenir grâce à
          PNFC.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center justify-center gap-2 rounded-lg h-14 px-8 bg-white text-primary text-base font-bold hover:bg-accent hover:text-white transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
        >
          <ArrowRight className="w-5 h-5" />
          <span>Explorer le catalogue</span>
        </Link>
      </div>
    </section>
  );
}
