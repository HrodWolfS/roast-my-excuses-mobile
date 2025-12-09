import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ACTIONS ASYNCHRONES (THUNKS)

// Charge l'utilisateur depuis le stockage local (AsyncStorage) au démarrage de l'app
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        return { token, user: JSON.parse(user) };
      }
      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue("Failed to load user");
    }
  }
);

// Inscription d'un nouvel utilisateur
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Sauvegarde des données pour la persistance (connexion automatique)
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.userName));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Impossible de contacter le serveur."
      );
    }
  }
);

// Connexion d'un utilisateur existant
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email ou mot de passe incorrect.");
      }

      // Sauvegarde des données pour la persistance
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.userName));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Impossible de contacter le serveur."
      );
    }
  }
);

// SLICE REDUX
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Déconnexion : réinitialise l'état et vide le stockage local
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      // Nettoyage de la persistance
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    },
    // Efface les messages d'erreur
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Gestion de loadUser (Chargement au démarrage)
    builder.addCase(loadUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });

    // Gestion de registerUser (Inscription)
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.userName;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Gestion de loginUser (Connexion)
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.userName;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
