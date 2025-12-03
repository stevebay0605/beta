import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

// --- ICONS ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-[#0055A4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-[#0055A4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

// --- INTERFACES ---
interface Role {
  id: number;
  name: string;
}

interface Country {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    country_id: number; // Essentiel pour le filtrage
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { verifyOtp, error: authError } = useAuth();
  
  // --- ÉTATS ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Données API
  const [roles, setRoles] = useState<Role[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Navigation
  const [viewState, setViewState] = useState('selection'); 
  const [entrepriseStep, setEntrepriseStep] = useState(1); 
  const [isAgreed, setIsAgreed] = useState<boolean | null>(null);

  const [otp, setOtp] = useState('');
  
  // Données Formulaire
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    entreprise_name: '',
    entreprise_sector: '',
    entreprise_adresse: '',
    entreprise_description: '',
    entreprise_country_id: '',
    entreprise_city_id: '',
    genre: '',
    date_naissance: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [documentsFiles, setDocumentsFiles] = useState<FileList | null>(null);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // On charge tout en parallèle pour gagner du temps
        const [rolesRes, countriesRes, citiesRes] = await Promise.all([
            axiosInstance.get('/admin/roles'),
            axiosInstance.get('/admin/countries'),
            axiosInstance.get('/admin/cities')
        ]);

        setRoles(rolesRes.data);
        setCountries(countriesRes.data);
        setCities(citiesRes.data);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        setError('Impossible de charger les données (rôles, pays, villes).');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTRAGE DYNAMIQUE DES VILLES ---
  // Utilisation de useMemo pour recalculer uniquement si cities ou le pays sélectionné change
  const availableCities = useMemo(() => {
      if (!formData.entreprise_country_id) return [];
      return cities.filter(city => city.country_id === Number(formData.entreprise_country_id));
  }, [cities, formData.entreprise_country_id]);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        
        // Si on change le pays, on réinitialise la ville pour éviter les incohérences
        if (name === 'entreprise_country_id') {
            newData.entreprise_city_id = '';
        }
        return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'documents') => {
      if (e.target.files && e.target.files.length > 0) {
          if (type === 'logo') setLogoFile(e.target.files[0]);
          if (type === 'documents') setDocumentsFiles(e.target.files);
      }
  };

  const handleRoleSelect = (roleKey: string) => {
    const role = roles.find(r => r.name.toLowerCase().includes(roleKey.toLowerCase()));
    if (role) {
      setFormData(prev => ({ ...prev, role_id: role.id.toString() }));
      setSelectedRoleName(roleKey);
      setViewState('form');
      setEntrepriseStep(1);
      setError('');
    } else {
      setError(`Le rôle "${roleKey}" est introuvable.`);
    }
  };

  const handleNextStep = () => {
    setError('');
    if (entrepriseStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
    }
    if (entrepriseStep === 2) {
        if (!formData.entreprise_name) {
            setError("Le nom de l'entreprise est obligatoire.");
            return;
        }
    }
    setEntrepriseStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setEntrepriseStep(prev => prev - 1);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Les mots de passe ne correspondent pas';
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('role_id', formData.role_id);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('password_confirmation', formData.confirmPassword);
      if (formData.phone) data.append('phone', formData.phone);

      if (selectedRoleName === 'entreprise') {
          data.append('entreprise_name', formData.entreprise_name);
          if (formData.entreprise_sector) data.append('entreprise_sector', formData.entreprise_sector);
          if (formData.entreprise_adresse) data.append('entreprise_adresse', formData.entreprise_adresse);
          if (formData.entreprise_description) data.append('entreprise_description', formData.entreprise_description);
          if (formData.entreprise_country_id) data.append('entreprise_country_id', formData.entreprise_country_id);
          if (formData.entreprise_city_id) data.append('entreprise_city_id', formData.entreprise_city_id);
          
          if (logoFile) data.append('logo', logoFile);
          
          if (isAgreed && documentsFiles) {
              for (let i = 0; i < documentsFiles.length; i++) {
                  data.append(`documents[${i}]`, documentsFiles[i]);
              }
          }
      } else {
          if (formData.genre) data.append('genre', formData.genre);
          if (formData.date_naissance) data.append('date_naissance', formData.date_naissance);
      }

      const response = await axiosInstance.post('/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Inscription réussie! Vérifiez votre email pour l\'OTP 📧');
      setViewState('otp');
      if (response.data.otp) console.log('OTP DEV:', response.data.otp);

    } catch (err) {
      console.error('Erreur inscription:', err);
      let errorMsg = 'Erreur lors de l\'inscription';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(formData.email, otp);
      toast.success('Email vérifié! Bienvenue 🎉');
      navigate('/dashboard');
    } catch (err) {
      let errorMsg = 'Code OTP invalide';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER OTP ---
  if (viewState === 'otp') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6 flex justify-center">
                <div className="bg-blue-50 p-4 rounded-full">
                    <svg className="w-12 h-12 text-[#0055A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Vérifiez votre email</h2>
            <p className="text-slate-600 mb-6 text-sm">Code envoyé à <span className="font-semibold text-slate-900">{formData.email}</span></p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            <form onSubmit={handleOtpSubmit}>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •" maxLength={6} className="w-full mb-6 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0055A4] focus:ring-0 text-center text-3xl tracking-[1em] font-bold text-slate-800 outline-none transition" />
                <button type="submit" disabled={loading} className="w-full bg-[#0055A4] text-white py-3.5 rounded-xl font-bold hover:bg-[#004484] transition shadow-lg shadow-blue-900/20">{loading ? 'Validation...' : 'Confirmer'}</button>
            </form>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN ---
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4 md:p-6">
      <div className={`w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${selectedRoleName === 'entreprise' ? 'max-w-2xl' : 'max-w-lg'}`}>
        
        <div className="bg-white p-8 pb-0 text-center">
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              {viewState === 'selection' ? 'Bienvenue sur PNFC' : 
               selectedRoleName === 'entreprise' ? 'Compte Entreprise' : 'Créer un compte'}
            </h2>
            <p className="text-slate-500 text-sm">
              {viewState === 'selection' ? 'Commencez par choisir votre type de profil' : 
               'Remplissez les informations ci-dessous'}
            </p>
        </div>

        <div className="p-8">
            {(error || authError) && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                {error || authError}
              </div>
            )}

            {viewState === 'selection' && (
              <div className="animate-fadeIn">
                {dataLoading ? (
                  <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#0055A4] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <button onClick={() => handleRoleSelect('particulier')} className="group flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-[#0055A4] hover:bg-blue-50 transition duration-300">
                      <div className="transform group-hover:scale-110 transition duration-300"><UserIcon /></div>
                      <span className="font-bold text-slate-700 group-hover:text-[#0055A4]">Particulier</span>
                    </button>
                    <button onClick={() => handleRoleSelect('entreprise')} className="group flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-[#0055A4] hover:bg-blue-50 transition duration-300">
                      <div className="transform group-hover:scale-110 transition duration-300"><BuildingIcon /></div>
                      <span className="font-bold text-slate-700 group-hover:text-[#0055A4]">Entreprise</span>
                    </button>
                  </div>
                )}
                <div className="text-center mt-6 pt-6 border-t border-slate-100">
                  <span className="text-slate-500 text-sm">Déjà membre ? </span>
                  <Link to="/login" className="text-[#0055A4] font-bold hover:underline text-sm">Se connecter</Link>
                </div>
              </div>
            )}

            {viewState === 'form' && (
              <form onSubmit={handleRegisterSubmit} className="animate-fadeIn">
                
                {/* --- PARTICULIER (Formulaire inchangé) --- */}
                {selectedRoleName === 'particulier' && (
                  <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                             <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom complet</label>
                             <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] focus:ring-0 outline-none transition" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] focus:ring-0 outline-none transition" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Téléphone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] focus:ring-0 outline-none transition" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Mot de passe</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] focus:ring-0 outline-none transition" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Confirmation</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] focus:ring-0 outline-none transition" />
                         </div>
                     </div>
                     <button type="submit" disabled={loading} className="w-full mt-6 bg-[#0055A4] text-white py-3.5 rounded-lg font-bold hover:bg-[#004484] transition shadow-lg shadow-blue-900/20">{loading ? 'Chargement...' : 'Créer mon compte'}</button>
                  </div>
                )}

                {/* --- ENTREPRISE --- */}
                {selectedRoleName === 'entreprise' && (
                  <div>
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${entrepriseStep >= step ? 'bg-[#0055A4] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                                    {step}
                                </div>
                                <span className={`text-[10px] mt-1 font-semibold uppercase ${entrepriseStep >= step ? 'text-[#0055A4]' : 'text-slate-400'}`}>
                                    {step === 1 ? 'Contact' : step === 2 ? 'Infos' : 'Docs'}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-[138px] md:top-[154px] left-0 w-full h-0.5 bg-slate-100 -z-0"></div> 
                    </div>

                    {/* ÉTAPE 1 : CONTACT */}
                    {entrepriseStep === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                             <div className="text-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800">Compte Utilisateur</h3>
                                <p className="text-xs text-slate-500">Informations du représentant</p>
                             </div>
                             <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom du représentant</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email professionnel</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Mot de passe</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Confirmer</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                                </div>
                             </div>
                             <button type="button" onClick={handleNextStep} className="w-full mt-4 bg-[#0055A4] text-white py-3 rounded-lg font-bold hover:bg-[#004484] transition">Suivant</button>
                        </div>
                    )}

                    {/* ÉTAPE 2 : INFOS ENTREPRISE (MODIFIÉE AVEC SELECT PAYS/VILLE) */}
                    {entrepriseStep === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="text-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800">Détails de l'entreprise</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Raison Sociale</label>
                                    <input type="text" name="entreprise_name" value={formData.entreprise_name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" placeholder="Ex: Ma Société SAS" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Secteur d'activité</label>
                                    <input type="text" name="entreprise_sector" value={formData.entreprise_sector} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" placeholder="Ex: Informatique" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Téléphone Ent.</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Adresse complète</label>
                                    <input type="text" name="entreprise_adresse" value={formData.entreprise_adresse} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition" />
                                </div>
                                
                                {/* SELECT PAYS */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pays</label>
                                    <select 
                                        name="entreprise_country_id" 
                                        value={formData.entreprise_country_id} 
                                        onChange={handleChange} 
                                        aria-label="Sélectionner un pays"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition appearance-none"
                                    >
                                        <option value="">Choisir un pays</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* SELECT VILLE (FILTRÉ) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ville</label>
                                    <select 
                                        name="entreprise_city_id" 
                                        value={formData.entreprise_city_id} 
                                        onChange={handleChange} 
                                        disabled={!formData.entreprise_country_id} // Désactivé si pas de pays choisi
                                        aria-label="Sélectionner une ville"
                                        className={`w-full px-4 py-3 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition appearance-none ${!formData.entreprise_country_id ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50'}`}
                                    >
                                        <option value="">
                                            {!formData.entreprise_country_id ? 'Sélectionnez un pays d\'abord' : 'Choisir une ville'}
                                        </option>
                                        {availableCities.map((city) => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                    <textarea name="entreprise_description" value={formData.entreprise_description} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0055A4] outline-none transition"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Logo</label>
                                    <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition cursor-pointer text-center">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => handleFileChange(e, 'logo')} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            aria-label="Télécharger le logo de l'entreprise"
                                            title="Télécharger le logo"
                                        />
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <UploadIcon />
                                            <span className="text-xs mt-1">{logoFile ? logoFile.name : "Cliquez pour uploader un logo (Max 5Mo)"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={handlePrevStep} className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition">Retour</button>
                                <button type="button" onClick={handleNextStep} className="flex-1 bg-[#0055A4] text-white py-3 rounded-lg font-bold hover:bg-[#004484] transition">Suivant</button>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 3 : DOCUMENTS (INCHANGÉE) */}
                    {entrepriseStep === 3 && (
                        <div className="space-y-6 animate-fadeIn text-center">
                            <div className="mb-6">
                                <h3 className="font-bold text-lg text-slate-800">Agrément Étatique</h3>
                                <p className="text-sm text-slate-500 mt-2">Êtes-vous agréé par l'État et possédez-vous des documents justificatifs ?</p>
                            </div>

                            <div className="flex justify-center gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAgreed(true)}
                                    className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${isAgreed === true ? 'border-[#0055A4] bg-blue-50 text-[#0055A4]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                >
                                    Oui, j'ai des documents
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAgreed(false)}
                                    className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${isAgreed === false ? 'border-[#0055A4] bg-blue-50 text-[#0055A4]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                >
                                    Non, pas encore
                                </button>
                            </div>

                            {isAgreed === true && (
                                <div className="animate-fadeIn p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Documents justificatifs (PDF, IMG...)</label>
                                    <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-white transition cursor-pointer text-center bg-white">
                                        <input 
                                            type="file" 
                                            multiple 
                                            onChange={(e) => handleFileChange(e, 'documents')} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            aria-label="Télécharger les documents justificatifs"
                                            title="Télécharger les documents"
                                        />
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <UploadIcon />
                                            <span className="text-sm mt-2 font-medium">Glissez vos fichiers ou cliquez ici</span>
                                            <span className="text-xs text-slate-400 mt-1">{documentsFiles ? `${documentsFiles.length} fichier(s) sélectionné(s)` : "Max 5Mo par fichier"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={handlePrevStep} className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition">Retour</button>
                                <button 
                                    type="submit" 
                                    disabled={loading || isAgreed === null} 
                                    className="flex-1 bg-[#0055A4] text-white py-3 rounded-lg font-bold hover:bg-[#004484] transition disabled:opacity-50 shadow-lg shadow-blue-900/20"
                                >
                                    {loading ? 'Finalisation...' : 'Terminer l\'inscription'}
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <button type="button" onClick={() => { setViewState('selection'); setError(''); }} className="text-xs text-slate-400 hover:text-[#0055A4] transition">
                        ← Changer de type de compte
                    </button>
                </div>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}