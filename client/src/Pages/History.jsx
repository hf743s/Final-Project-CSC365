// src/Pages/History.jsx
import { useEffect, useState } from "react";
import "./History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("workoutHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const workoutNames = [...new Set(history.map((w) => w, idx))]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }


  return (
    <div className="page-inner">
      <h2>Workout History</h2>
      {history.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <div className="history-list">
          {history.map((entry, idx) => (
            <div key={idx} className="history-entry">
              <h3>{formatDate(entry.date)} - {entry.name}</h3>
              <ul>
                {entry.exercises.map((ex, exIdx) => (
                  <li key={exIdx}>
                    <strong>{ex.name}</strong>: Sets: {ex.sets}, Reps: {ex.reps}, Weights: {ex.weights.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )    
}
