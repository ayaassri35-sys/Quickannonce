import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const jwtUtils = {
  // Stocker le token
  setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  },

  // Récupérer le token
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },

  // Stocker le refresh token
  setRefreshToken(token) {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Erreur lors du stockage du refresh token:', error);
    }
  },

  // Récupérer le refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du refresh token:', error);
      return null;
    }
  },

  // Décoder le token
  decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  },

  // Vérifier si le token est valide
  isTokenValid(token = null) {
    const currentToken = token || this.getToken();
    if (!currentToken) return false;

    try {
      const decoded = this.decodeToken(currentToken);
      if (!decoded) return false;

      // Vérifier si le token n'est pas expiré
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  },

  // Récupérer l'utilisateur depuis le token
  getUserFromToken(token = null) {
    const currentToken = token || this.getToken();
    if (!currentToken || !this.isTokenValid(currentToken)) return null;

    try {
      const decoded = this.decodeToken(currentToken);
      return {
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'user'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  // Supprimer les tokens
  clearTokens() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
    }
  },

  // Vérifier si le token va expirer bientôt (dans les 5 prochaines minutes)
  isTokenExpiringSoon(token = null) {
    const currentToken = token || this.getToken();
    if (!currentToken) return true;

    try {
      const decoded = this.decodeToken(currentToken);
      if (!decoded) return true;

      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;
      return timeUntilExpiry < 300; // 5 minutes
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token:', error);
      return true;
    }
  }
};
