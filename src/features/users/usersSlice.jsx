import { createSlice, nanoid } from "@reduxjs/toolkit";

// Charger les utilisateurs depuis localStorage
const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      const users = JSON.parse(stored);
      // Vérifier si l'admin existe et a le bon mot de passe
      const adminUser = users.find(u => u.email === "admin@admin.com");
      if (adminUser && adminUser.password !== "admin123") {
        // Mettre à jour le mot de passe admin
        adminUser.password = "admin123";
        localStorage.setItem('users', JSON.stringify(users));
      }
      return users;
    }
    return [
      {
        id: "admin",
        nom: "Admin",
        prenom: "Root",
        email: "admin@admin.com",
        password: "admin123",
        role: "admin",
      },
    ];
  } catch (error) {
    return [
      {
        id: "admin",
        nom: "Admin",
        prenom: "Root",
        email: "admin@admin.com",
        password: "admin123",
        role: "admin",
      },
    ];
  }
};

// Sauvegarder les utilisateurs dans localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Erreur de sauvegarde des utilisateurs:', error);
  }
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: loadUsersFromStorage(),
  },
  reducers: {
    registerUser: {
      reducer: (state, action) => {
        console.log("=== DÉBOGAGE INSCRIPTION ===");
        console.log("Nouvel utilisateur à ajouter:", action.payload);
        console.log("Utilisateurs avant ajout:", state.items);
        
        state.items.push(action.payload);
        saveUsersToStorage(state.items);
        
        console.log("Utilisateurs après ajout:", state.items);
      },
      prepare(user) {
        return {
          payload: {
            id: nanoid(),
            role: "user",
            ...user,
          },
        };
      },
    },

    deleteUser(state, action) {
      state.items = state.items.filter(u => u.id !== action.payload);
      saveUsersToStorage(state.items);
    },
  },
});

export const { registerUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
