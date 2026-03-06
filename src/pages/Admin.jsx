import { useDispatch, useSelector } from "react-redux";
import { updateEtat, deleteAnnoncesByUser } from "../features/annonces/annoncesSlice";
import { deleteUser } from "../features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Get raw data from Redux
  const annonces = useSelector(state => state.annonces.items);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [connectedUsers, setConnectedUsers] = useState([]);

  // Mock users data for demo (since we're using JWT without user database)
  const mockUsers = [
    {
      id: '1',
      email: 'admin@example.com',
      nom: 'Admin',
      prenom: 'User',
      role: 'admin'
    },
    {
      id: '2', 
      email: 'user@example.com',
      nom: 'Regular',
      prenom: 'User',
      role: 'user'
    }
  ];

  // Memoized filtered data
  const annoncesEnAttente = useMemo(() => 
    annonces.filter(a => a.etat === "en_attente"), 
    [annonces]
  );
  
  const annoncesAcceptees = useMemo(() => 
    annonces.filter(a => a.etat === "acceptee"), 
    [annonces]
  );
  
  const annoncesRefusees = useMemo(() => 
    annonces.filter(a => a.etat === "refusee"), 
    [annonces]
  );

  // Vérifier si l'utilisateur est admin dans useEffect
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Simuler des utilisateurs connectés (à remplacer par un vrai système de tracking)
  useEffect(() => {
    // Pour l'instant, on simule que l'utilisateur actuel est connecté
    if (isAuthenticated && user) {
      setConnectedUsers([{
        ...user,
        connectionTime: new Date().toLocaleString('fr-FR'),
        lastActivity: new Date().toLocaleString('fr-FR')
      }]);
    }
  }, [isAuthenticated, user]);

  // Rafraîchissement automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Forcer le re-rendu quand lastUpdate change
  useEffect(() => {
    // Le composant va se re-render automatiquement quand les données Redux changent
  }, [lastUpdate]);

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px 0"
    }}>
      <div className="container">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{
            width: "80px",
            height: "80px",
            background: "#c4a590",
            boxShadow: "0 4px 15px rgba(196, 165, 144, 0.3)"
          }}>
            <i className="bi bi-shield-check text-white fs-1"></i>
          </div>
          <h1 className="fw-bold mb-1" style={{color: "#2d3748"}}>Panneau d'Administration</h1>
          <p className="text-muted mb-0">Gérez les annonces et les utilisateurs</p>
          
          {/* Bouton de rafraîchissement */}
          <button 
            className="btn btn-outline-secondary mt-3"
            onClick={() => window.location.reload()}
            style={{
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "14px"
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Rafraîchir
          </button>
        </div>

        <div className="row">
          {/* Annonces en attente */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow h-100 border-0" style={{
              borderRadius: "15px",
              overflow: "hidden"
            }}>
              <div className="card-header" style={{
                background: "#ffc107",
                color: "white",
                fontWeight: "bold",
                padding: "15px"
              }}>
                <i className="bi bi-clock me-2"></i>
                Annonces en Attente ({annoncesEnAttente.length})
              </div>
              <div className="card-body" style={{maxHeight: "400px", overflowY: "auto"}}>
                {annoncesEnAttente.length === 0 ? (
                  <p className="text-muted text-center">Aucune annonce en attente</p>
                ) : (
                  annoncesEnAttente.map(a => (
                    <div key={a.id} className="border rounded p-3 mb-3" style={{
                      backgroundColor: "#fff",
                      borderLeft: "4px solid #ffc107"
                    }}>
                      <h6 className="fw-bold mb-2">{a.titre}</h6>
                      <p className="text-muted small mb-2">{a.ville} - {a.prix ? a.prix + " DH" : "Prix non défini"}</p>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => dispatch(updateEtat({ id: a.id, etat: "acceptee" }))}
                          style={{
                            borderRadius: "20px",
                            padding: "5px 15px"
                          }}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Accepter
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => dispatch(updateEtat({ id: a.id, etat: "refusee" }))}
                          style={{
                            borderRadius: "20px",
                            padding: "5px 15px"
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Annonces acceptées */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow h-100 border-0" style={{
              borderRadius: "15px",
              overflow: "hidden"
            }}>
              <div className="card-header" style={{
                background: "#28a745",
                color: "white",
                fontWeight: "bold",
                padding: "15px"
              }}>
                <i className="bi bi-check-circle me-2"></i>
                Annonces Acceptées ({annoncesAcceptees.length})
              </div>
              <div className="card-body" style={{maxHeight: "400px", overflowY: "auto"}}>
                {annoncesAcceptees.length === 0 ? (
                  <p className="text-muted text-center">Aucune annonce acceptée</p>
                ) : (
                  annoncesAcceptees.map(a => (
                    <div key={a.id} className="border rounded p-3 mb-3" style={{
                      backgroundColor: "#fff",
                      borderLeft: "4px solid #28a745"
                    }}>
                      <h6 className="fw-bold mb-2">{a.titre}</h6>
                      <p className="text-muted small mb-2">{a.ville} - {a.prix ? a.prix + " DH" : "Prix non défini"}</p>
                      <span className="badge bg-success text-white">Acceptée</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Annonces refusées */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow h-100 border-0" style={{
              borderRadius: "15px",
              overflow: "hidden"
            }}>
              <div className="card-header" style={{
                background: "#dc3545",
                color: "white",
                fontWeight: "bold",
                padding: "15px"
              }}>
                <i className="bi bi-x-circle me-2"></i>
                Annonces Refusées ({annoncesRefusees.length})
              </div>
              <div className="card-body" style={{maxHeight: "400px", overflowY: "auto"}}>
                {annoncesRefusees.length === 0 ? (
                  <p className="text-muted text-center">Aucune annonce refusée</p>
                ) : (
                  annoncesRefusees.map(a => (
                    <div key={a.id} className="border rounded p-3 mb-3" style={{
                      backgroundColor: "#fff",
                      borderLeft: "4px solid #dc3545"
                    }}>
                      <h6 className="fw-bold mb-2">{a.titre}</h6>
                      <p className="text-muted small mb-2">{a.ville} - {a.prix ? a.prix + " DH" : "Prix non défini"}</p>
                      <span className="badge bg-danger text-white">Refusée</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gestion des utilisateurs */}
        <div className="card shadow mt-4 border-0" style={{
          borderRadius: "15px",
          overflow: "hidden"
        }}>
          <div className="card-header" style={{
            background: "#c4a590",
            color: "white",
            fontWeight: "bold",
            padding: "15px"
          }}>
            <i className="bi bi-people me-2"></i>
            Gestion des Utilisateurs
          </div>
          <div className="card-body">
            {mockUsers.length === 0 ? (
              <p className="text-muted text-center">Aucun utilisateur enregistré</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nom</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.nom} {u.prenom}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'admin' ? 'bg-danger' : 'bg-primary'
                          }`}>
                            {u.role === 'admin' ? '🛡️ Admin' : '👤 Utilisateur'}
                          </span>
                        </td>
                        <td>
                          {u.role !== "admin" && (
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (window.confirm(`Supprimer l'utilisateur ${u.email} et toutes ses annonces ?`)) {
                                  // Note: deleteUser ne fonctionnera pas avec JWT sans base de données
                                  console.log('Suppression utilisateur:', u.email);
                                }
                              }}
                              style={{
                                borderRadius: "20px",
                                padding: "5px 15px",
                                fontSize: "12px"
                              }}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Supprimer
                            </button>
                          )}
                          {u.role === "admin" && (
                            <span className="text-muted small">
                              <i className="bi bi-shield-check me-1"></i>
                              Protégé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Utilisateurs connectés */}
        <div className="card shadow mt-4 border-0" style={{
          borderRadius: "15px",
          overflow: "hidden"
        }}>
          <div className="card-header" style={{
            background: "#28a745",
            color: "white",
            fontWeight: "bold",
            padding: "15px"
          }}>
            <i className="bi bi-person-check me-2"></i>
            Utilisateurs Connectés ({connectedUsers.length})
          </div>
          <div className="card-body">
            {connectedUsers.length === 0 ? (
              <p className="text-muted text-center">Aucun utilisateur connecté</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nom</th>
                      <th>Rôle</th>
                      <th>Heure de connexion</th>
                      <th>Dernière activité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectedUsers.map((u, index) => (
                      <tr key={`connected-${index}`}>
                        <td>{u.email}</td>
                        <td>{u.nom} {u.prenom}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'admin' ? 'bg-danger' : 'bg-success'
                          }`}>
                            {u.role === 'admin' ? '🛡️ Admin' : '👤 Utilisateur'}
                          </span>
                        </td>
                        <td>
                          <i className="bi bi-clock me-1"></i>
                          {u.connectionTime}
                        </td>
                        <td>
                          <i className="bi bi-activity me-1"></i>
                          {u.lastActivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
