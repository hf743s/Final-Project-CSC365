// src/Pages/Workout.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Workout.css";
import PropTypes from "prop-types"

export default function Workout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  useEffect(() => {
    if (location.state?.workout) {
      setWorkout(location.state.workout);
      const initialLogs = location.state.workout.exercises.map((ex) => ({
        weights: Array(ex.sets).fill(""),
        reps: Array(ex.sets).fill(""),
      }));
      setExerciseLogs(initialLogs);
    } else {
      navigate("/planning");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  if (!workout) return <div>Loading Workout...</div>;

  const currentExercise = workout.exercises[exerciseIndex];

  const handleWeightChange = (value) => {
    const updated = [...exerciseLogs];
    updated[exerciseIndex].weights[setIndex] = value;
    setExerciseLogs(updated);
  };

  const handleRepsChange = (value) => {
    const updated = [...exerciseLogs];
    updated[exerciseIndex].reps[setIndex] = value;
    setExerciseLogs(updated);
  };

  const isLastSet = () =>
    exerciseIndex === workout.exercises.length - 1 &&
    setIndex === currentExercise.sets - 1;

  const nextSet = () => {
    if (setIndex < currentExercise.sets - 1) {
      setSetIndex(setIndex + 1);
    } else if (exerciseIndex < workout.exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
      setSetIndex(0);
    } else {
      finishWorkout();
    }
  };

  const prevSet = () => {
    if (setIndex > 0) {
      setSetIndex(setIndex - 1);
    } else if (exerciseIndex > 0) {
      const prevExercise = workout.exercises[exerciseIndex - 1];
      setExerciseIndex(exerciseIndex - 1);
      setSetIndex(prevExercise.sets - 1);
    }
  };

  const skipSet = () => nextSet();

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
        actualReps: exerciseLogs[idx].reps,
      })),
    });
    localStorage.setItem("history", JSON.stringify(history));
    navigate("/history");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="active-workout-container">
      {/* Timer */}
      <div className="timer">{formatTime(timer)}</div>

      {/* Exercise Info */}
      <div className="exercise-info">
        <h2>{currentExercise.name}</h2>
        <h3>
          Set {setIndex + 1} of {currentExercise.sets}
        </h3>
      </div>

      {/* Inputs */}
      <div className="inputs-container">
        <div className="planned">
          <div>Planned Weight: {currentExercise.weights[setIndex]}</div>
          <div>
            Actual Weight:{" "}
            <input
              type="number"
              min={0}
              value={exerciseLogs[exerciseIndex]?.weights[setIndex] || ""}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="planned">
          <div>Planned Reps: {currentExercise.reps}</div>
          <div>
            Actual Reps:{" "}
            <input
              type="number"
              min={0}
              value={exerciseLogs[exerciseIndex]?.reps[setIndex] || ""}
              onChange={(e) => handleRepsChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Buttons on screen borders below header */}
      <div className="top-left">
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={skipSet}>Skip</button>
      </div>

      <div className="top-right">
        <button className="end-btn" onClick={finishWorkout}>
          End
        </button>
      </div>

      <div className="bottom-left">
        <button
          onClick={prevSet}
          disabled={exerciseIndex === 0 && setIndex === 0}
        >
          Back
        </button>
      </div>

      <div className="bottom-right">
        <button onClick={nextSet}>{isLastSet() ? "End" : "Next"}</button>
      </div>
    </div>
  );
}

Workout.propTypes = {
  workout: PropTypes.shape({
    name: PropTypes.string.isRequired,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        sets: PropTypes.number.isRequired,
        reps: PropTypes.number.isRequired,
        weights: PropTypes.arrayOf(PropTypes.number),
      })
    )
  })
}