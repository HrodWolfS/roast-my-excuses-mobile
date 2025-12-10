import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// On importe ton instance API configurée (avec le token header auto)
import api from "../../services/api";

// --- THUNKS (Actions Asynchrones) ---

// 1. Créer une tâche (Le cœur du réacteur)
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      // taskData contient { description, excuse, type }
      const response = await api.post("/tasks", taskData);
      // On retourne la tâche créée (qui contient le roast !)
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors du roast"
      );
    }
  }
);

// 2. Récupérer le feed
export const getFeedTasks = createAsyncThunk(
  "tasks/getFeed",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/feed?page=${page}`);
      return response.data.data; // Supposons que ça renvoie { tasks, pagination }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur chargement feed"
      );
    }
  }
);

// --- SLICE ---

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    currentTask: null,
    feedTasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Actions synchrones (si besoin plus tard, ex: nettoyer l'erreur)
    clearError: (state) => {
      state.error = null;
    },
    // Utile quand on quitte l'écran de résultat pour revenir à zéro
    resetCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Gestion de createTask ---
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        // BINGO : On stocke la réponse ici.
        // L'écran suivant (RoastResult) n'aura qu'à lire state.tasks.currentTask
        state.currentTask = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Gestion de getFeedTasks (Préparation) ---
      .addCase(getFeedTasks.pending, (state) => {
        // On pourrait avoir un loading séparé feedLoading pour ne pas bloquer toute l'app
        state.loading = true;
      })
      .addCase(getFeedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedTasks = action.payload.tasks;
      })
      .addCase(getFeedTasks.rejected, (state, action) => {
        state.loading = false;
        // On ne bloque pas l'user si le feed plante, on log juste
        console.error("Feed error", action.payload);
      });
  },
});

export const { clearError, resetCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
