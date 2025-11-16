// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import Planning from "./Pages/Planning";
import Workout from "./Pages/Workout";
import History from "./Pages/History";
import "./index.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  return (
    <Router>
      <AppContent
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={setSelectedWorkout}
      />
    </Router>
  );
}

function AppContent({ menuOpen, setMenuOpen, selectedWorkout, setSelectedWorkout }) {
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();
  const navigate = useNavigate();

  // Show Start button only on Planning page and if workout selected with 1+ exercises
  const showStartButton =
    location.pathname === "/planning" &&
    selectedWorkout &&
    selectedWorkout.exercises.length > 0;

  return (
    <div className="app">
      {/* Toolbar */}
      <div className="toolbar">
        <button className="hamburger" onClick={toggleMenu}>☰</button>
        <h1>Workout Website</h1>
        {showStartButton && (
          <button className="start-btn" onClick={() => navigate("/workout")}>
            Start
          </button>
        )}
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
          <Route
            path="/planning"
            element={<Planning setSelectedWorkout={setSelectedWorkout} />}
          />
          <Route path="/workout" element={<Workout workout={selectedWorkout} />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
}
