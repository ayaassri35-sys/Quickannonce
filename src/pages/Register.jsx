import { useState } from "react";
import { useDispatch } from "react-redux";
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

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;

    // Validation des entrées
    if (!validateEmail(form.email.value)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (!validatePassword(form.password.value)) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (form.password.value !== form.confirmPassword.value) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Appeler le service d'inscription
      const response = await authService.register(
        form.email.value,
        form.password.value,
        `${form.prenom.value} ${form.nom.value}`
      );
      
      if (response.success) {
        // Stocker les tokens dans Redux
        dispatch(login({
          token: response.token,
          refreshToken: response.refreshToken
        }));
        
        navigate("/");
      } else {
        setError("Échec de l'inscription");
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
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
                background: "#e55a3a",
                boxShadow: "0 4px 15px rgba(229, 90, 58, 0.3)"
              }}>
                <i className="bi bi-person-plus-fill text-white fs-1"></i>
              </div>
              <h2 className="fw-bold mb-1" style={{color: "#2d3748"}}>Créer un compte</h2>
              <p className="text-muted mb-0">Rejoignez QuickAnnonce dès aujourd'hui</p>
            </div>

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label small text-muted fw-semibold">Nom</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      name="nom"
                      className="form-control border-start-0"
                      placeholder="Votre nom"
                      style={{borderLeft: "none"}}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted fw-semibold">Prénom</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      name="prenom"
                      className="form-control border-start-0"
                      placeholder="Votre prénom"
                      style={{borderLeft: "none"}}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-start-0"
                    placeholder="votre.email@exemple.com"
                    style={{borderLeft: "none"}}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control border-start-0"
                    placeholder="Min 6 caractères"
                    minLength="6"
                    style={{borderLeft: "none"}}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted fw-semibold">Confirmer le mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-lock-fill text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control border-start-0"
                    placeholder="Répétez le mot de passe"
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
                  backgroundColor: "#e55a3a",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(229, 90, 58, 0.3)"
                }}
                disabled={isLoading}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#d64525";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(229, 90, 58, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#e55a3a";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(229, 90, 58, 0.3)";
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Inscription en cours...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p className="mb-0 text-muted">
                Déjà un compte ?{" "}
                <Link 
                  to="/connexion" 
                  className="text-decoration-none fw-semibold"
                  style={{
                    color: "#c4a590",
                    transition: "color 0.3s ease"
                  }}
                  onMouseOver={(e) => e.target.style.color = "#b3947f"}
                  onMouseOut={(e) => e.target.style.color = "#c4a590"}
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
