import axios from "axios";

console.log("Axios Base URL:", axios.defaults.baseURL);

axios.defaults.baseURL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://music-app-api-oq6b.onrender.com";

// axios.defaults.baseURL = "https://music-app-api-oq6b.onrender.com";

export default axios;
