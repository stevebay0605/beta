import { useState } from 'react';
import { Mail, Phone, Calendar, User, Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../hooks/useProfile';
import { Validator } from '../utils/Validator';

interface UpdateProfileData {
  name?: string;
  phone?: string;
  genre?: string;
  date_naissance?: string;
  bio?: string;
}

interface ProfileFormProps {
  user: UserProfile | null;
  loading: boolean;
  onUpdateProfile: (data: UpdateProfileData) => Promise<void>;
  onUpdatePassword: (current: string, newPass: string, confirm: string) => Promise<void>;
}

export function ProfileForm({ user, loading, onUpdateProfile, onUpdatePassword }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form Info
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    genre: user?.genre || '',
    date_naissance: user?.date_naissance || '',
    bio: user?.bio || '',
  });

  // Form Password
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gérer changement des champs info
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur pour ce champ
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Gérer changement des champs password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Submit info
  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validations
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit avoir au minimum 2 caractères';
    }

    if (formData.phone && !Validator.validatePhone(formData.phone).isValid) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onUpdateProfile({
        name: formData.name,
        phone: formData.phone,
        genre: formData.genre,
        date_naissance: formData.date_naissance,
        bio: formData.bio,
      });
    } catch {
      // Erreur déjà gérée
    }
  };

  // Submit password
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Mot de passe actuel requis';
    }

    const passwordValidation = Validator.validatePassword(passwordData.new_password);
    if (!passwordValidation.isValid) {
      newErrors.new_password = passwordValidation.message;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onUpdatePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      // Erreur déjà gérée
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === 'info'
              ? 'border-[#0055A4] text-[#0055A4]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User size={18} className="inline mr-2" />
          Informations personnelles
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === 'password'
              ? 'border-[#0055A4] text-[#0055A4]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock size={18} className="inline mr-2" />
          Mot de passe
        </button>
      </div>

      {/* Tab: Informations */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmitInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom */}
            <div>
              <label htmlFor="name-input" className="block text-sm font-bold text-slate-700 mb-2">
                <User size={16} className="inline mr-2" />
                Nom complet *
              </label>
              <input
                id="name-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInfoChange}
                title="Nom complet"
                required
                className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email (lecture seule) */}
            <div>
              <label htmlFor="email-input" className="block text-sm font-bold text-slate-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                id="email-input"
                type="email"
                value={user?.email || ''}
                disabled
                title="Email non modifiable"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Non modifiable</p>
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone-input" className="block text-sm font-bold text-slate-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Téléphone
              </label>
              <input
                id="phone-input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInfoChange}
                placeholder="+243123456789"
                title="Numéro de téléphone"
                className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre-select" className="block text-sm font-bold text-slate-700 mb-2">
                Genre
              </label>
              <select
                id="genre-select"
                name="genre"
                value={formData.genre}
                onChange={handleInfoChange}
                title="Sélectionner votre genre"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
              >
                <option value="">Non spécifié</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
                <option value="O">Autre</option>
              </select>
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="dob-input" className="block text-sm font-bold text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date de naissance
              </label>
              <input
                id="dob-input"
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleInfoChange}
                title="Date de naissance"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio-textarea" className="block text-sm font-bold text-slate-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio-textarea"
              name="bio"
              value={formData.bio}
              onChange={handleInfoChange}
              placeholder="Parlez un peu de vous..."
              title="Bio"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0055A4] text-white py-2.5 rounded-lg font-bold hover:bg-[#004484] transition disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </form>
      )}

      {/* Tab: Mot de passe */}
      {activeTab === 'password' && (
        <form onSubmit={handleSubmitPassword} className="space-y-4 max-w-md">
          {/* Mot de passe actuel */}
          <div>
            <label htmlFor="current-pass" className="block text-sm font-bold text-slate-700 mb-2">
              Mot de passe actuel *
            </label>
            <div className="relative">
              <input
                id="current-pass"
                type={showPassword ? 'text' : 'password'}
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                title="Mot de passe actuel"
                required
                className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition ${
                  errors.current_password ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="new-pass" className="block text-sm font-bold text-slate-700 mb-2">
              Nouveau mot de passe *
            </label>
            <div className="relative">
              <input
                id="new-pass"
                type={showNewPassword ? 'text' : 'password'}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                title="Nouveau mot de passe"
                required
                className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition ${
                  errors.new_password ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
                title={showNewPassword ? 'Masquer' : 'Afficher'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>
            )}
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label htmlFor="confirm-pass" className="block text-sm font-bold text-slate-700 mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              id="confirm-pass"
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              title="Confirmation du mot de passe"
              required
              className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition ${
                errors.confirm_password ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0055A4] text-white py-2.5 rounded-lg font-bold hover:bg-[#004484] transition disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      )}
    </div>
  );
}
