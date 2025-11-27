import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-[#0055A4]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Prêt à commencer ?
        </h2>
        <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de jeunes qui transforment leur avenir grâce à
          D-CLIC.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center justify-center gap-2 rounded-lg h-14 px-8 bg-white text-[#0055A4] text-base font-bold hover:bg-slate-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>Explorer le catalogue</span>
        </Link>
      </div>
    </section>
  );
}
