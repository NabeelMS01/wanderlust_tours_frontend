// src/config.js
const config = {
    API_BASE_URL: process.env.BACKEND_API_ENDPOINT || "http://localhost:4000/api",
    SERVER_URL: process.env.REACT_APP_BACKEND_API_ENDPOINT|| "http://localhost:4000",
    JWT_SECRET:process.env.JWT_SECRET
  };
  
  export default config;
  