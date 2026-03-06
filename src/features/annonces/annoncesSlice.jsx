import { createSlice, nanoid } from "@reduxjs/toolkit";
import annoncesData from "../../data/data";

// Charger les annonces depuis localStorage
const loadAnnoncesFromStorage = () => {
  try {
    const stored = localStorage.getItem('annonces');
    if (stored) {
      return JSON.parse(stored);
    }
    // Premier chargement: utiliser les données initiales
    const initialData = annoncesData.map(a => ({
      ...a,
      id: nanoid(),
      datePoster: new Date().toISOString(),
      etat: "acceptee", // ✅ إعلانات data.json مقبولة تلقائياً
    }));
    localStorage.setItem('annonces', JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    return annoncesData.map(a => ({
      ...a,
      id: nanoid(),
      datePoster: new Date().toISOString(),
      etat: "acceptee",
    }));
  }
};

// Sauvegarder les annonces dans localStorage
const saveAnnoncesToStorage = (annonces) => {
  try {
    localStorage.setItem('annonces', JSON.stringify(annonces));
  } catch (error) {
    console.error('Erreur de sauvegarde des annonces:', error);
  }
};

const initialState = {
  items: loadAnnoncesFromStorage(),
  filters: {
    motcle: "",
    categorieId: "",
    ville: "",
    prixmin: "",
    prixmax: "",
  },
};

const annoncesSlice = createSlice({
  name: "annonces",
  initialState,
  reducers: {
    // إضافة إعلان nouveau (de Publish)
    addAnnonce: {
      reducer(state, action) {
        console.log("Ajout d'une nouvelle annonce:", action.payload);
        state.items.push(action.payload);
        saveAnnoncesToStorage(state.items);
      },
      prepare(data) {
        return {
          payload: {
            id: nanoid(),
            datePoster: new Date().toISOString(),
            etat: data.etat || "en_attente", // Les annonces des utilisateurs sont en attente de validation par défaut
            ...data,
          },
        };
      },
    },

    // ✅ قبول / ❌ رفض إعلان (Admin)
    updateEtat(state, action) {
      const annonce = state.items.find(a => a.id === action.payload.id);
      if (annonce) {
        annonce.etat = action.payload.etat;
        saveAnnoncesToStorage(state.items);
      }
    },

    // 🗑️ حذف إعلان
    deleteAnnonce(state, action) {
      state.items = state.items.filter(a => a.id !== action.payload);
      saveAnnoncesToStorage(state.items);
    },

    // 🗑️ حذف إعلانات مستخدم
    deleteAnnoncesByUser(state, action) {
      state.items = state.items.filter(a => a.userId !== action.payload);
      saveAnnoncesToStorage(state.items);
    },

    // 🔍  searsh
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // ♻️ إعادة تعيين الفلاتر
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addAnnonce,
  updateEtat,
  deleteAnnonce,
  deleteAnnoncesByUser,
  setFilters,
  resetFilters,
} = annoncesSlice.actions;

export default annoncesSlice.reducer;
