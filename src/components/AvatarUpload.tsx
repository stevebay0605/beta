import { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

export function AvatarUpload({ currentAvatar, userName = 'User', onUpload, loading = false }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File) => {
    // Valider le fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Format d\'image non valide. Acceptés: JPEG, PNG, WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop volumineuse (max 5MB)');
      return;
    }

    // Afficher aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      await onUpload(file);
      setPreviewUrl(null);
    } catch {
      // Erreur déjà gérée dans useProfile
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const avatarUrl = previewUrl || currentAvatar || null;
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#0055A4] shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0055A4] to-[#003d7a] flex items-center justify-center border-4 border-slate-200 shadow-lg">
            <span className="text-white text-4xl font-bold">{initials}</span>
          </div>
        )}

        {/* Upload Button */}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-[#0055A4] hover:bg-[#004484] text-white rounded-full p-3 cursor-pointer shadow-lg transition transform hover:scale-110"
          title="Changer d'avatar"
        >
          <Camera size={20} />
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            disabled={loading}
            className="hidden"
            aria-label="Télécharger un avatar"
          />
        </label>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-sm border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging
            ? 'border-[#0055A4] bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-[#0055A4]'
        }`}
      >
        <Upload className="mx-auto mb-2 text-slate-400" size={24} />
        <p className="text-sm font-semibold text-slate-700">
          Glissez votre image ici
        </p>
        <p className="text-xs text-slate-500 mt-1">
          ou cliquez sur le bouton caméra
        </p>
        <p className="text-xs text-slate-400 mt-2">
          JPEG, PNG, WebP • Max 5MB
        </p>
      </div>

      {previewUrl && (
        <button
          onClick={() => setPreviewUrl(null)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <X size={16} />
          Annuler aperçu
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0055A4]"></div>
          <span className="text-sm text-slate-600">Upload en cours...</span>
        </div>
      )}
    </div>
  );
}
