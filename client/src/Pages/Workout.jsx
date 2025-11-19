// src/Pages/Workout.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Workout.css";


export default function Workout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [workout,setWorkout] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);


  // Load workout from planning
  useEffect(() => {
    if (location.state?.workout) {
      setWorkout(location.state.workout);

      const initialLogs = location.state.workout.exercises.map(ex => ({weights: Array(ex.sets).fill(""),}))
      setExerciseLogs(initialLogs);

    }else {
      navigate("/planning");
    }
  }, []);


  //Changing weight
  const handWeightChange = (exIdx, setIdx, value) => {
    const updatedLogs = [...exerciseLogs];
    updatedLogs[exIdx].weights[setIdx] = value;
    setExerciseLogs(updatedLogs);
  };


  //Finish workout and save to history
  const finishWorkout = () => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.push({
      name: workout.name,
      date: new Date().toLocaleString(),
      exercises: workout.exercises.map((ex, idx) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weights: exerciseLogs[idx].weights,
      }))
    });
    localStorage.setItem("history", JSON.stringify(history));
    navigate("/history")
  }

  if (!workout) return <div>Loading workout...</div>


  return (
    <div className="workout-container">
      <h2>{workout.name}</h2>
      
      {workout.exercises.map((ex, exIdx) => (
        <div key={exIdx} className="exercise-block">
          <h3>{ex.name}</h3>
          {Array.from({ length: ex.sets }).map((_, setIdx) => (
            <div key={setIdx} className="set-block">
              <label>Set {setIdx + 1}:</label>
              <input type="number"
                min={0}
                placeholder="Weight"
                value={exerciseLogs[exIdx]?.weights[setIdx] ?? ""}
                onChange={(e) => handleWeightChange(exIdx, setIdx, e.target.value)
                }
              />
              <span>Reps: {ex.reps}</span>
            </div>
          ))}
        </div>
      ))}

      <button className="finish-btn" onClick={finishWorkout}> Finish Workout</button>
    </div>
  );
}
