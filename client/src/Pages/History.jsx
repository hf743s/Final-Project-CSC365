// src/Pages/History.jsx
import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);


  return (
    <div className="page-inner">
      <h2>Workout History</h2>
      {history.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <ul>
          {history.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.date}</strong>: {entry.workoutName} -{" "}
              {entry.exercises.map((ex) => ex.name).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
