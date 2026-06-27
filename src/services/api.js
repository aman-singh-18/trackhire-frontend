import axios from "axios";

const API = axios.create({
  // Since we set up the Vite proxy, pointing to /api routing is sufficient
  baseURL: "/api", 
  withCredentials: true, // Crucial for sending/receiving JWT cookies
});

export default API;