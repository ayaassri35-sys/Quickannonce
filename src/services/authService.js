import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:3001/api';

class AuthService {
  // Inscription avec vrai backend
  async register(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  // Connexion avec vrai backend
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Rafraîchir le token
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Échec du rafraîchissement');
      }
    } catch (error) {
      console.error('Erreur de rafraîchissement:', error);
      throw error;
    }
  }

  // Déconnexion
  async logout() {
    try {
      const token = jwtUtils.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // Même si l'appel échoue, on considère la déconnexion comme réussie côté client
      return { success: true };
    }
  }

  // Obtenir les infos de l'utilisateur courant
  async getCurrentUser() {
    try {
      const token = jwtUtils.getToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return jwtUtils.isTokenValid();
  }

  // Obtenir l'utilisateur depuis le token local
  getUserFromToken() {
    return jwtUtils.getUserFromToken();
  }

  // Obtenir le token actuel
  getToken() {
    return jwtUtils.getToken();
  }
}

export default new AuthService();
