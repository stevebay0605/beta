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
    <div className="p-6">
      {/* Price */}
      <div className="mb-6">
        <p className="text-slate-600 text-sm mb-2">Prix de la formation</p>
        <div className="text-4xl font-black text-[#0055A4] mb-2">
          {price === 0 ? 'Gratuit' : `${price.toLocaleString('fr-FR')} FC`}
        </div>
        <p className="text-slate-500 text-sm">Prix fixe, une seule fois</p>
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

      {/* Terms Checkbox */}
      <label className="label cursor-pointer justify-start gap-3 mb-6">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="checkbox checkbox-primary"
        />
        <span className="label-text text-sm text-gray-dark">
          Je reconnais avoir lu et accepté les{' '}
          <a href="#" className="text-primary font-semibold hover:text-accent hover:underline transition-colors duration-200">
            conditions d'utilisation
          </a>{' '}
          et la{' '}
          <a href="#" className="text-primary font-semibold hover:text-accent hover:underline transition-colors duration-200">
            politique de confidentialité
          </a>
        </span>
      </label>

      {/* Enroll Button */}
      <button
        onClick={handleEnroll}
        disabled={isSubmitting || !agreed}
        className="btn btn-primary w-full text-lg hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Inscription en cours...
          </>
        ) : (
          'S\'inscrire maintenant'
        )}
      </button>

      {/* Money Back Guarantee */}
      <div className="alert alert-success p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-semibold">Garantie satisfait ou remboursé 30 jours</span>
      </div>
    </div>
  );
}
