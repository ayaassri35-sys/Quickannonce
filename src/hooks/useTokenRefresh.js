import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtUtils } from '../utils/jwtUtils';
import { refreshTokens, logout } from '../features/auth/authSlice';
import authService from '../services/authService';

export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Vérifier si le token expire bientôt
    const checkTokenExpiry = () => {
      if (jwtUtils.isTokenExpiringSoon()) {
        const refreshToken = jwtUtils.getRefreshToken();
        
        if (refreshToken) {
          // Rafraîchir le token
          authService.refreshToken(refreshToken)
            .then(response => {
              if (response.success) {
                dispatch(refreshTokens({ token: response.token }));
              } else {
                // Échec du rafraîchissement, déconnexion
                dispatch(logout());
              }
            })
            .catch(error => {
              console.error('Erreur lors du rafraîchissement du token:', error);
              dispatch(logout());
            });
        } else {
          // Pas de refresh token, déconnexion
          dispatch(logout());
        }
      }
    };

    // Vérifier immédiatement
    checkTokenExpiry();

    // Configurer une vérification périodique (toutes les 4 minutes)
    const interval = setInterval(checkTokenExpiry, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);
};
