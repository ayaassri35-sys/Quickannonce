import { useDispatch, useSelector } from "react-redux";
import { addAnnonce } from "../features/annonces/annoncesSlice";
import { useNavigate } from "react-router-dom";

export default function Publish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const submit = e => {
    e.preventDefault();
    const f = e.target;

    const files = f.photos.files;
    const image = files.length > 0 ? URL.createObjectURL(files[0]) : null;

    dispatch(addAnnonce({
      titre: f.titre.value,
      description: f.description.value,
      prix: Number(f.prix.value),
      ville: f.ville.value,
      image, 
      userId: user?.id,
    }));
    navigate("/");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px 0"
    }}>
      <div className="col-md-8 col-lg-6">
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
                <i className="bi bi-plus-circle text-white fs-1"></i>
              </div>
              <h2 className="fw-bold mb-1" style={{color: "#2d3748"}}>Publier une annonce</h2>
              <p className="text-muted mb-0">Partagez votre annonce avec la communauté</p>
            </div>

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Titre de l'annonce</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-type text-muted"></i>
                  </span>
                  <input
                    name="titre"
                    className="form-control border-start-0"
                    placeholder="Donnez un titre attractif à votre annonce"
                    style={{borderLeft: "none"}}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Description</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 align-items-start" style={{paddingTop: "12px"}}>
                    <i className="bi bi-text-paragraph text-muted"></i>
                  </span>
                  <textarea
                    name="description"
                    className="form-control border-start-0"
                    placeholder="Décrivez votre annonce en détail..."
                    style={{borderLeft: "none", minHeight: "120px", resize: "vertical"}}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label small text-muted fw-semibold">Prix (DH)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-currency-euro text-muted"></i>
                    </span>
                    <input
                      name="prix"
                      type="number"
                      className="form-control border-start-0"
                      placeholder="0"
                      style={{borderLeft: "none"}}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted fw-semibold">Ville</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-geo-alt text-muted"></i>
                    </span>
                    <input
                      name="ville"
                      className="form-control border-start-0"
                      placeholder="Votre ville"
                      style={{borderLeft: "none"}}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted fw-semibold">Photos</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-camera text-muted"></i>
                  </span>
                  <input
                    type="file"
                    name="photos"
                    className="form-control border-start-0"
                    style={{borderLeft: "none"}}
                    multiple
                    accept="image/*"
                  />
                </div>
                <small className="text-muted">Vous pouvez sélectionner plusieurs photos</small>
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
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#d64525";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(229, 90, 58, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#e55a3a";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(229, 90, 58, 0.3)";
                }}
              >
                <i className="bi bi-send-fill me-2"></i>
                Publier l'annonce
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
