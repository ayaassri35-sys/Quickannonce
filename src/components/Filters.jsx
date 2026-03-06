// src/components/Filters.jsx
import { useDispatch } from "react-redux";
import { setFilters, resetFilters } from "../features/annonces/annoncesSlice";

export default function Filters() {
  const dispatch = useDispatch();

  return (
    <div className="card p-3 mb-3">
      <input
        className="form-control mb-2"
        placeholder="Mot clé"
        onChange={e => dispatch(setFilters({ motcle: e.target.value }))}
      />

      <input
        className="form-control mb-2"
        placeholder="Ville"
        onChange={e => dispatch(setFilters({ ville: e.target.value }))}
      />

      <div className="d-flex gap-2">
        <input
          type="number"
          className="form-control"
          placeholder="Prix min"
          onChange={e =>
            dispatch(setFilters({ prixmin: e.target.value ? Number(e.target.value) : "" }))
          }
        />
        <input
          type="number"
          className="form-control"
          placeholder="Prix max"
          onChange={e =>
            dispatch(setFilters({ prixmax: e.target.value ? Number(e.target.value) : "" }))
          }
        />
      </div>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => dispatch(resetFilters())}
      >
        Réinitialiser
      </button>
    </div>
  );
}
