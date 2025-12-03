import { useState } from 'react';
import { Users, Clock, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface EnrollmentFormProps {
  formationId: number;
  title: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
  enrolledCount?: number;
}

export function EnrollmentForm({
  formationId,
  title,
  price,
  instructor,
  duration,
  level,
  enrolledCount = 0,
}: EnrollmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleEnroll = async () => {
    if (!agreed) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simuler l'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Inscription réussie! Accédez à la formation depuis votre tableau de bord.');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-8 sticky top-24 h-fit">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>

      {/* Price */}
      <div className="mb-6">
        <div className="text-4xl font-black text-[#0055A4] mb-2">
          {price === 0 ? 'Gratuit' : `${price.toLocaleString('fr-FR')} $`}
        </div>
        <p className="text-sm text-slate-600">Accès complet à vie</p>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Award size={20} className="text-[#0055A4] flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-600">Niveau</p>
            <p className="font-semibold text-slate-900">{level}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={20} className="text-[#0055A4] flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-600">Durée</p>
            <p className="font-semibold text-slate-900">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users size={20} className="text-[#0055A4] flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-600">Inscrits</p>
            <p className="font-semibold text-slate-900">{enrolledCount.toLocaleString('fr-FR')} étudiants</p>
          </div>
        </div>
      </div>

      {/* Instructor */}
      <div className="mb-6">
        <p className="text-sm text-slate-600 mb-2">Instructeur</p>
        <p className="font-semibold text-slate-900">{instructor}</p>
      </div>

      {/* Enroll Button */}
      <button
        onClick={handleEnroll}
        disabled={isSubmitting}
        className="w-full px-6 py-4 bg-gradient-to-r from-[#0055A4] to-[#0055A4]/90 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 mb-4 text-lg"
      >
        {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire maintenant'}
      </button>

      {/* Share Button */}
      <button
        className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition mb-6"
        onClick={() => {
          const text = `Découvrez la formation "${title}" sur notre plateforme!`;
          if (navigator.share) {
            navigator.share({ title, text });
          } else {
            navigator.clipboard.writeText(text);
            toast.success('Lien copié!');
          }
        }}
      >
        Partager
      </button>

      {/* Terms Checkbox */}
      <label className="flex items-start gap-3 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-[#0055A4] focus:ring-[#0055A4]"
        />
        <span className="text-sm text-slate-600">
          Je reconnais avoir lu et accepté les{' '}
          <a href="#" className="text-[#0055A4] font-semibold hover:underline">
            conditions d'utilisation
          </a>{' '}
          et la{' '}
          <a href="#" className="text-[#0055A4] font-semibold hover:underline">
            politique de confidentialité
          </a>
        </span>
      </label>

      {/* Money Back Guarantee */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-sm text-green-700 font-semibold">
          ✓ Garantie satisfait ou remboursé 30 jours
        </p>
      </div>
    </div>
  );
}
