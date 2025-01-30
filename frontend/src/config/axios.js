import axios from "axios";

axios.defaults.baseURL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://music-app-api-oq6b.onrender.com";

// axios.defaults.baseURL = "https://music-app-api-oq6b.onrender.com";

export default axios;
