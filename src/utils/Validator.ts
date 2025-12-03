/**
 * Utilitaire pour les validations côté client
 * Validations email, password strength, téléphone, etc.
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'success';
}

export class Validator {
  /**
   * Valide un email selon RFC 5322 simplifié
   */
  static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, message: 'Email requis', severity: 'error' };
    }
    
    if (email.length > 254) {
      return { isValid: false, message: 'Email trop long (max 254 caractères)', severity: 'error' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Format email invalide', severity: 'error' };
    }
    
    return { isValid: true, message: 'Email valide', severity: 'success' };
  }

  /**
   * Valide la force du mot de passe
   * Critères: 8+ caractères, majuscule, minuscule, chiffre, caractère spécial (optionnel)
   */
  static validatePassword(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, message: 'Mot de passe requis', severity: 'error' };
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Minimum 8 caractères', severity: 'warning' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    // eslint-disable-next-line no-useless-escape
    const hasSpecialChar = /[!@#$%^&*()_+=\[\]{};:'"\\|,.<>/?-]/.test(password);

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;

    if (strength < 3) {
      return {
        isValid: false,
        message: 'Mot de passe faible. Utilisez majuscules, minuscules et chiffres',
        severity: 'warning',
      };
    }

    return { isValid: true, message: 'Mot de passe fort', severity: 'success' };
  }

  /**
   * Valide un numéro de téléphone (format international)
   */
  static validatePhone(phone: string): ValidationResult {
    if (!phone) {
      return { isValid: false, message: 'Téléphone requis', severity: 'error' };
    }

    // Accepte les formats: +243123456789, 0243123456789, 243123456789
    const phoneRegex = /^(\+)?[0-9]{1,3}[0-9]{6,14}$/;

    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return { isValid: false, message: 'Format téléphone invalide', severity: 'error' };
    }

    return { isValid: true, message: 'Téléphone valide', severity: 'success' };
  }

  /**
   * Valide une date de naissance (âge minimum)
   */
  static validateDateOfBirth(dateString: string, minAge: number = 18): ValidationResult {
    if (!dateString) {
      return { isValid: false, message: 'Date de naissance requise', severity: 'error' };
    }

    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < minAge) {
      return { 
        isValid: false, 
        message: `Vous devez avoir au minimum ${minAge} ans`, 
        severity: 'error' 
      };
    }

    return { isValid: true, message: `Âge: ${age} ans`, severity: 'success' };
  }

  /**
   * Valide le match de deux mots de passe
   */
  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (!password || !confirmPassword) {
      return { isValid: false, message: 'Les deux mots de passe sont requis', severity: 'error' };
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: 'Les mots de passe ne correspondent pas', severity: 'error' };
    }

    return { isValid: true, message: 'Mots de passe identiques', severity: 'success' };
  }

  /**
   * Valide un nom (prénom/nom)
   */
  static validateName(name: string, minLength: number = 2): ValidationResult {
    if (!name) {
      return { isValid: false, message: 'Nom requis', severity: 'error' };
    }

    const trimmedName = name.trim();
    if (trimmedName.length < minLength) {
      return { 
        isValid: false, 
        message: `Minimum ${minLength} caractères`, 
        severity: 'error' 
      };
    }

    if (trimmedName.length > 100) {
      return { isValid: false, message: 'Maximum 100 caractères', severity: 'error' };
    }

    // Vérifier qu'il n'y a que des lettres, espaces et tirets
    if (!/^[a-zA-ZÀ-ÿ\s\-']*$/.test(trimmedName)) {
      return { isValid: false, message: 'Caractères invalides', severity: 'error' };
    }

    return { isValid: true, message: 'Nom valide', severity: 'success' };
  }

  /**
   * Valide le nom d'une entreprise
   */
  static validateCompanyName(name: string): ValidationResult {
    if (!name) {
      return { isValid: false, message: 'Nom entreprise requis', severity: 'error' };
    }

    if (name.length < 3) {
      return { isValid: false, message: 'Minimum 3 caractères', severity: 'error' };
    }

    if (name.length > 255) {
      return { isValid: false, message: 'Maximum 255 caractères', severity: 'error' };
    }

    return { isValid: true, message: 'Nom entreprise valide', severity: 'success' };
  }

  /**
   * Valide le fichier (taille et type)
   */
  static validateFile(file: File, maxSizeMB: number = 5, allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']): ValidationResult {
    if (!file) {
      return { isValid: false, message: 'Fichier requis', severity: 'error' };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        isValid: false, 
        message: `Fichier trop volumineux (max ${maxSizeMB}MB)`, 
        severity: 'error' 
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        message: `Type de fichier non autorisé. Acceptés: ${allowedTypes.join(', ')}`, 
        severity: 'error' 
      };
    }

    return { isValid: true, message: 'Fichier valide', severity: 'success' };
  }

  /**
   * Valide une URL
   */
  static validateURL(url: string): ValidationResult {
    if (!url) {
      return { isValid: false, message: 'URL requise', severity: 'error' };
    }

    try {
      new URL(url);
      return { isValid: true, message: 'URL valide', severity: 'success' };
    } catch {
      return { isValid: false, message: 'URL invalide', severity: 'error' };
    }
  }
}

/**
 * Hook pour obtenir les messages d'erreur utilisateur-friendly
 */
export const getValidationErrorMessage = (field: string): string => {
  const messages: { [key: string]: string } = {
    email: 'Veuillez entrer une adresse email valide',
    password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
    confirmPassword: 'Les mots de passe ne correspondent pas',
    phone: 'Veuillez entrer un numéro de téléphone valide',
    dateOfBirth: 'Vous devez avoir au minimum 18 ans',
    name: 'Veuillez entrer un nom valide',
    companyName: 'Veuillez entrer le nom de l\'entreprise',
  };

  return messages[field] || 'Données invalides';
};
