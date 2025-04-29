import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "../src/Context/AuthContext.tsx"; // ✅ Import this

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
