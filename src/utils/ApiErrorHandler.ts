/**
 * Utilitaire centralisé pour la gestion des erreurs API
 * Standardise les erreurs et les messages
 */

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export class ApiErrorHandler {
  /**
   * Parse une erreur axios et la transforme en ApiError standardisé
   */
  static handleError(error: unknown): ApiError {
    if (!(error instanceof Error)) {
      return {
        status: 0,
        message: 'Une erreur inconnue s\'est produite',
        code: 'UNKNOWN_ERROR',
      };
    }

    // Vérifier si c'est une erreur axios
    if (!('response' in error)) {
      if ('request' in error) {
        return {
          status: 0,
          message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
          code: 'NETWORK_ERROR',
          details: { request: String(error.request) },
        };
      }
      // Erreur de configuration
      return {
        status: 0,
        message: 'Erreur de configuration de la requête',
        code: 'CONFIG_ERROR',
        details: { message: error.message },
      };
    }

    const response = error.response as { status: number; data?: ApiErrorResponse };
    const status = response?.status || 0;
    const data = response?.data || {};

    // Erreurs serveur spécifiques
    switch (status) {
      case 400:
        return this.handle400(data);
      case 401:
        return this.handle401(data);
      case 403:
        return this.handle403(data);
      case 404:
        return this.handle404(data);
      case 422:
        return this.handle422(data);
      case 429:
        return this.handle429(data);
      case 500:
        return this.handle500(data);
      case 503:
        return this.handle503(data);
      default:
        return {
          status,
          message: (data as ApiErrorResponse).message || 'Une erreur est survenue',
          code: 'UNKNOWN_ERROR',
          details: data,
        };
    }
  }

  private static handle400(data: ApiErrorResponse): ApiError {
    return {
      status: 400,
      message: data.message || 'Mauvaise requête - Vérifiez les données envoyées',
      code: 'BAD_REQUEST',
      details: data.errors || data,
    };
  }

  private static handle401(data: ApiErrorResponse): ApiError {
    return {
      status: 401,
      message: 'Votre session a expiré. Veuillez vous reconnecter.',
      code: 'UNAUTHORIZED',
      details: data,
    };
  }

  private static handle403(data: ApiErrorResponse): ApiError {
    return {
      status: 403,
      message: 'Vous n\'avez pas les permissions pour effectuer cette action',
      code: 'FORBIDDEN',
      details: data,
    };
  }

  private static handle404(data: ApiErrorResponse): ApiError {
    return {
      status: 404,
      message: 'La ressource demandée n\'existe pas',
      code: 'NOT_FOUND',
      details: data,
    };
  }

  private static handle422(data: ApiErrorResponse): ApiError {
    return {
      status: 422,
      message: data.message || 'Les données envoyées sont invalides',
      code: 'VALIDATION_ERROR',
      details: data.errors || data,
    };
  }

  private static handle429(data: ApiErrorResponse): ApiError {
    return {
      status: 429,
      message: 'Trop de requêtes. Veuillez attendre quelques minutes.',
      code: 'RATE_LIMIT',
      details: data,
    };
  }

  private static handle500(data: ApiErrorResponse): ApiError {
    return {
      status: 500,
      message: 'Erreur serveur. Veuillez réessayer plus tard.',
      code: 'SERVER_ERROR',
      details: data,
    };
  }

  private static handle503(data: ApiErrorResponse): ApiError {
    return {
      status: 503,
      message: 'Le serveur est actuellement indisponible. Veuillez réessayer plus tard.',
      code: 'SERVICE_UNAVAILABLE',
      details: data,
    };
  }

  /**
   * Récupère le message utilisateur-friendly d'une erreur
   */
  static getUserMessage(error: ApiError): string {
    return error.message;
  }

  /**
   * Vérifie si c'est une erreur de validation
   */
  static isValidationError(error: ApiError): boolean {
    return error.status === 422;
  }

  /**
   * Récupère les erreurs de validation individuelles
   */
  static getValidationErrors(error: ApiError): Record<string, string[]> {
    if (!this.isValidationError(error) || !error.details?.errors) {
      return {};
    }

    const errors: Record<string, string[]> = {};
    const errorDetails = error.details.errors as Record<string, unknown>;

    // Format Laravel: { field: ['message1', 'message2'] }
    for (const [field, messages] of Object.entries(errorDetails)) {
      errors[field] = Array.isArray(messages) ? (messages as string[]) : [String(messages)];
    }

    return errors;
  }

  /**
   * Log l'erreur en développement
   */
  static logError(error: ApiError, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`❌ Erreur API ${context ? `- ${context}` : ''}`);
      console.error('Status:', error.status);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      if (error.details) console.error('Details:', error.details);
      console.groupEnd();
    }
  }
}

/**
 * Hook pour formater les messages d'erreur
 */
export const formatErrorMessage = (error: ApiError, fieldName?: string): string => {
  if (fieldName) {
    const validationErrors = ApiErrorHandler.getValidationErrors(error);
    return validationErrors[fieldName]?.[0] || error.message;
  }
  return error.message;
};
