import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
