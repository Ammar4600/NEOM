import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // ✅ Corrected

const socket = io(import.meta.env.VITE_BASE, {
  auth: { token }, // ✅ Send token during connection
  transports: ["websocket"], // Recommended for real-time apps
  reconnectionAttempts: 5, // Tries reconnecting 5 times before failing
});

export { socket };
