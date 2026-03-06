import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

// Validation de l'email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validation du mot de passe
const validatePassword = (password) => {
  return password.length >= 6; // Minimum 6 caractères
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const { email, password } = e.target;

    // Validation des entrées
    if (!validateEmail(email.value)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (!validatePassword(password.value)) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Debug: afficher les données envoyées
      console.log("=== DÉBOGAGE CONNEXION FRONTEND ===");
      console.log("Email:", email.value);
      console.log("Password:", password.value);
      
      // Appeler le service d'authentification
      const response = await authService.login(email.value, password.value);
      
      console.log("Réponse du backend:", response);
      
      if (response.success) {
        // Stocker les tokens dans Redux
        dispatch(login({
          token: response.token,
          refreshToken: response.refreshToken
        }));
        
        navigate("/");
      } else {
        setError("Échec de la connexion");
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0" style={{
          borderRadius: "20px",
          overflow: "hidden"
        }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
                width: "80px",
                height: "80px",
                background: "#c4a590",
                boxShadow: "0 4px 15px rgba(196, 165, 144, 0.3)"
              }}>
                <i className="bi bi-box-arrow-in-right text-white fs-1"></i>
              </div>
              <h2 className="fw-bold mb-1" style={{color: "#2d3748"}}>Connexion</h2>
              <p className="text-muted mb-0">Connectez-vous à votre compte QuickAnnonce</p>
            </div>

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    name="email"
                    className="form-control border-start-0"
                    placeholder="Votre adresse email"
                    type="email"
                    style={{borderLeft: "none"}}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control border-start-0"
                    placeholder="Votre mot de passe"
                    minLength="6"
                    style={{borderLeft: "none"}}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-semibold text-white"
                style={{
                  backgroundColor: "#c4a590",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(196, 165, 144, 0.3)"
                }}
                disabled={isLoading}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#b3947f";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(196, 165, 144, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#c4a590";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(196, 165, 144, 0.3)";
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Connexion en cours...
                  </>
                ) : (
                  'Connexion'
                )}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p className="mb-0 text-muted">
                Pas encore de compte ?{" "}
                <Link 
                  to="/inscription" 
                  className="text-decoration-none fw-semibold"
                  style={{
                    color: "#e55a3a",
                    transition: "color 0.3s ease"
                  }}
                  onMouseOver={(e) => e.target.style.color = "#d64525"}
                  onMouseOut={(e) => e.target.style.color = "#e55a3a"}
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
