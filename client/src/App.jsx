// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from "./Pages/Landing";
import Planning from "./Pages/Planning";
import Workout from "./Pages/Workout";
import History from "./Pages/History";
import "./index.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <Router>
      <div className="app">
        {/* Toolbar */}
        <div className="toolbar">
          <button className="hamburger" onClick={toggleMenu}>☰</button>
          <h1>Workout Website</h1>
        </div>

        {/* Side menu */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          {menuOpen && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Landing</Link>
              <Link to="/planning" onClick={() => setMenuOpen(false)}>Planning</Link>
              <Link to="/history" onClick={() => setMenuOpen(false)}>History</Link>
            </>
          )}
        </div>

        {/* Overlay */}
        {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

        {/* Page content */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
