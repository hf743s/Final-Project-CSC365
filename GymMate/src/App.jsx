import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Landing from "./Pages/Landing";
import Planning from "./Pages/Planning";
import Workout from "./Pages/Workout";
import History from "./Pages/History";
import NotFound from "./Pages/NotFound";
import ExerciseLibrary from "./Pages/ExerciseLibrary";
import "./index.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [workouts, setWorkouts] = useState([])
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null)

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <Router>
      <div className="app">
        {/* Toolbar */}
        <Toolbar toggleMenu={toggleMenu} />

        {/* Side menu */}
        <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

        {/* Overlay */}
        {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

        {/* Page content */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/exercises"
              element={
              <ExerciseLibrary
                workouts={workouts}
                setWorkouts={setWorkouts}
                selectedWorkoutIndex={selectedWorkoutIndex}
              />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Toolbar component
function Toolbar({ toggleMenu }) {
  const location = useLocation();

  return (
    <div className="toolbar">
      <button className="hamburger" onClick={toggleMenu}>☰</button>
      <h1>GymMate</h1>
    </div>
  );
}

// Side menu component
function SideMenu({ menuOpen, toggleMenu }) {
  return (
    <div className={`side-menu ${menuOpen ? "open" : ""}`}>
      {menuOpen && (
        <>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/planning" onClick={toggleMenu}>Planning</Link>
          <Link to="/history" onClick={toggleMenu}>History</Link>
        </>
      )}
    </div>
  );
}
