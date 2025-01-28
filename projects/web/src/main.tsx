import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./reset.css";
import { Index } from "./Index.tsx";
import { Header } from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:country" element={<App />} />
        </Routes>
      </main>
    </Router>
  </StrictMode>
);
