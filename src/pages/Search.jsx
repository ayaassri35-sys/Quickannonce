import Filters from "../components/Filters";
import { useSelector } from "react-redux";
import { selectFilteredAnnonces } from "../features/annonces/annoncesSelectors";
import AdCard from "../components/AdCard";

export default function Search() {
  const annonces = useSelector(selectFilteredAnnonces);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <Filters />
        </div>
        <div className="col-md-9">
          <h4>{annonces.length} résultat(s)</h4>
          <div className="row">
            {annonces.map(a => (
              <AdCard key={a.id} annonce={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
