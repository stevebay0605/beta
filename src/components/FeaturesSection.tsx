import { BookOpen, Filter, Globe } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Formations Variées',
      description:
        "Accédez à des formations de qualité provenant d'organisations réputées du monde entier.",
      bgColor: 'bg-blue-600/20',
      iconColor: 'text-blue-600',
    },
    {
      icon: Filter,
      title: 'Filtrage Intelligent',
      description:
        'Filtrez par pays, domaine, durée et type de formation pour trouver exactement ce que vous cherchez.',
      bgColor: 'bg-orange-600/20',
      iconColor: 'text-orange-600',
    },
    {
      icon: Globe,
      title: 'Portée Mondiale',
      description:
        "Connectez-vous avec des opportunités de formation à travers le monde, incluant l'OIF et les institutions internationales.",
      bgColor: 'bg-blue-600/20',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Pourquoi D-CLIC ?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Une plateforme centralisée pour accéder à toutes les opportunités de
            formation et développer vos compétences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div
                  className={`size-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
