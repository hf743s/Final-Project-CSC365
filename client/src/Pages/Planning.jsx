import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Planning.css";

export default function Planning() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null);

  const [showWorkoutPopup, setShowWorkoutPopup] = useState(false);
  const [showExercisePopup, setShowExercisePopup] = useState(false);

  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: 1,
    reps: "",
    weights: [],
    setsInput: "",
    repsInput: "",
  });

  const navigate = useNavigate();

  // Load workouts from localStorage
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const selectedWorkout =
    selectedWorkoutIndex !== null && workouts[selectedWorkoutIndex]
      ? workouts[selectedWorkoutIndex]
      : null;

  const handleAddWorkout = () => {
    if (!newWorkoutName.trim()) return;
    setWorkouts([...workouts, { name: newWorkoutName, exercises: [] }]);
    setNewWorkoutName("");
    setShowWorkoutPopup(false);
  };

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim() || !selectedWorkout) return;

    const repsValue = parseInt(exerciseForm.reps) || 1;

    const exercise = {
      name: exerciseForm.name,
      sets: exerciseForm.sets,
      reps: repsValue,
      weights: exerciseForm.weights.map((w) => parseInt(w) || 0),
    };

    const updatedWorkouts = workouts.map((w, idx) =>
      idx === selectedWorkoutIndex
        ? { ...w, exercises: [...w.exercises, exercise] }
        : w
    );
    setWorkouts(updatedWorkouts);

    setExerciseForm({
      name: "",
      sets: 1,
      reps: "",
      weights: [],
      setsInput: "",
      repsInput: "",
    });
    setShowExercisePopup(false);
    // Keep selection after adding exercise
    setSelectedWorkoutIndex(selectedWorkoutIndex);
  };

  const handleWeightChange = (index, value) => {
    const newWeights = [...exerciseForm.weights];
    const num = Math.max(0, parseInt(value) || 0);
    newWeights[index] = num;
    setExerciseForm({ ...exerciseForm, weights: newWeights });
  };

  const handleSetsInput = (value) => {
    let num = parseInt(value) || 1;
    if (num < 1) num = 1;
    if (num > 3) num = 3;
    setExerciseForm({
      ...exerciseForm,
      setsInput: value,
      sets: num,
      weights: Array(num).fill(""),
    });
  };

  const handleRepsInput = (value) => {
    let num = parseInt(value);
    if (num >= 1) {
      setExerciseForm({ ...exerciseForm, repsInput: value, reps: num });
    } else if (value === "") {
      setExerciseForm({ ...exerciseForm, repsInput: "", reps: 1 });
    }
  };

  const handleStartWorkout = () => {
    if (!selectedWorkout || selectedWorkout.exercises.length === 0) return;
    navigate("/workout", { state: { workout: selectedWorkout } });
  };

  return (
    <div className="planning-container-bordered">
      {/* Start Button */}
      {selectedWorkout && selectedWorkout.exercises.length > 0 && (
        <button className="start-workout-btn" onClick={handleStartWorkout}>
          Start Workout
        </button>
      )}

      {/* Workouts Column */}
      <div className="column workouts-column">
        <div className="column-header">
          <span className="header-text">Workouts</span>
          <button
            className="header-add-btn"
            onClick={() => setShowWorkoutPopup(true)}
          >
            +
          </button>
        </div>
        {workouts.map((w, idx) => (
          <div
            key={idx}
            className={`exercise-item workout-item ${
              selectedWorkoutIndex === idx ? "selected" : ""
            }`}
            onClick={() => setSelectedWorkoutIndex(idx)}
          >
            {w.name}
          </div>
        ))}
      </div>

      {/* Exercises Column */}
      <div className="column exercises-column">
        <div className="column-header">
          <span className="header-text">Exercises</span>
          {selectedWorkout && (
            <button
              className="header-add-btn"
              onClick={() => setShowExercisePopup(true)}
            >
              +
            </button>
          )}
        </div>
        {selectedWorkout &&
          selectedWorkout.exercises.map((ex, idx) => (
            <div key={idx} className="exercise-item">
              {ex.name}
            </div>
          ))}
      </div>

      {/* Sets Column */}
      <div className="column sets-column">
        <div className="column-header">
          <span className="header-text">Sets</span>
        </div>
        {selectedWorkout &&
          selectedWorkout.exercises.map((ex, idx) => (
            <div key={idx} className="exercise-item">
              {ex.sets}
            </div>
          ))}
      </div>

      {/* Reps Column */}
      <div className="column reps-column">
        <div className="column-header">
          <span className="header-text">Reps</span>
        </div>
        {selectedWorkout &&
          selectedWorkout.exercises.map((ex, idx) => (
            <div key={idx} className="exercise-item">
              {ex.reps}
            </div>
          ))}
      </div>

      {/* Starting Weight Column */}
      <div className="column weight-column">
        <div className="column-header">
          <span className="header-text">Starting Weight</span>
        </div>
        {selectedWorkout &&
          selectedWorkout.exercises.map((ex, idx) => (
            <div key={idx} className="exercise-item">
              {ex.weights[0] ?? 0}
            </div>
          ))}
      </div>

      {/* Workout Popup */}
      {showWorkoutPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>New Workout</h3>
            <label>Workout Name:</label>
            <input
              type="text"
              placeholder="Workout Name"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
            />
            <button onClick={handleAddWorkout}>Add</button>
            <button onClick={() => setShowWorkoutPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Exercise Popup */}
      {showExercisePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>New Exercise</h3>
            <label>Exercise Name:</label>
            <input
              type="text"
              placeholder="Exercise Name"
              value={exerciseForm.name}
              onChange={(e) =>
                setExerciseForm({ ...exerciseForm, name: e.target.value })
              }
            />

            <label>Number of Sets (1-3):</label>
            <input
              type="number"
              placeholder="Sets"
              min={1}
              max={3}
              value={exerciseForm.setsInput}
              onChange={(e) => handleSetsInput(e.target.value)}
            />

            <label>Number of Reps:</label>
            <input
              type="number"
              min={1}
              placeholder="Reps"
              value={exerciseForm.repsInput}
              onChange={(e) => handleRepsInput(e.target.value)}
            />

            {Array.from({ length: exerciseForm.sets }).map((_, idx) => (
              <div key={idx}>
                <label>Weight for Set {idx + 1}:</label>
                <input
                  type="number"
                  min={0}
                  value={exerciseForm.weights[idx] ?? ""}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                />
              </div>
            ))}

            <button onClick={handleAddExercise}>Add Exercise</button>
            <button onClick={() => setShowExercisePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
