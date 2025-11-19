// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from "./Pages/Landing";
import Planning from "./Pages/Planning";
import Workout from "./Pages/Workout";
import History from "./Pages/History";
import "./index.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  }

  return (
    <Router>
      {/* Hamburger Menu Icon */}
      <button className="hamburger-menu" onClick={toggleMenu}>
        &#9776;
      </button>

        {/* Side menu */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        {menuOpen && (
          <>
            <Link to="/" onClick={() => setMenuOpen(false)}>Landing</Link>
            <Link to="/planning" onClick={() => setMenuOpen(false)}>Planning</Link>
            <Link to="/workout" onClick={() => setMenuOpen(false)}>Workout</Link>
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
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );


}export default App;
