import axios from "axios";
import { environment } from "../environment";

console.log(" Testing Axios Base URL:", axios.defaults.baseURL);

// axios.defaults.baseURL = import.meta.env.DEV
//   ? "http://localhost:8080"
//   : "https://music-app-api-oq6b.onrender.com";

axios.defaults.baseURL = environment.development
  ? "http://localhost:8080"
  : "https://music-app-api-oq6b.onrender.com";

console.log(" Testing Axios Base URL Today:", axios.defaults.baseURL);
// axios.defaults.baseURL =
//   import.meta.env.VITE_API_URL || "http://localhost:8080";

export default axios;
