import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Planning.css";
import PropTypes from "prop-types";

export default function Planning() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null);
  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState(null);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

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

  // Load workouts from localStorage (planned + history)
  useEffect(() => {
    const savedPlanned = localStorage.getItem("workouts");
    let plannedWorkouts = savedPlanned ? JSON.parse(savedPlanned) : [];
    setWorkouts(plannedWorkouts)

    const savedHistory = localStorage.getItem("workoutHistory"); // adjust key if different
    let historyWorkouts = savedHistory ? JSON.parse(savedHistory) : [];

    // Combine planned workouts and history for redo functionality
    const combinedWorkouts = [...historyWorkouts];

    setWorkouts(combinedWorkouts);

    if (combinedWorkouts.length > 0) {
      setSelectedWorkoutIndex(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const selectedWorkout =
    selectedWorkoutIndex !== null && workouts[selectedWorkoutIndex] ? workouts[selectedWorkoutIndex] : null;

  const handleAddWorkout = () => {
    if (!newWorkoutName.trim()) return;

    //editing workouts
    if (editingWorkoutIndex !== null) {
      const updated = [...workouts]
      updated[editingWorkoutIndex] = {
        ...updated[editingWorkoutIndex],
        name: newWorkoutName
      }
      setWorkouts(updated)
      setEditingWorkoutIndex(null)
      setNewWorkoutName("")
      setShowWorkoutPopup(false)
      return;
    }
    
    //creating new workout
    const newWorkout = { name: newWorkoutName, exercises: [] };
    setWorkouts([...workouts, newWorkout]);
    setNewWorkoutName("");
    setShowWorkoutPopup(false);
    setSelectedWorkoutIndex(workouts.length); // select new workout
  };

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim() || !selectedWorkout) return

    const repsValue = parseInt(exerciseForm.reps) || 1

    const exercise = {
      name: exerciseForm.name,
      sets: exerciseForm.sets,
      reps: repsValue,
      weights: exerciseForm.weights.map((w) => parseInt(w) || 0),
    };

    const updatedWorkouts = [...workouts]

    if(editingExerciseIndex !== null) {
      updatedWorkouts[selectedWorkoutIndex].exercises[editingExerciseIndex] = exercise
      setEditingExerciseIndex(null)
    } else {
      updatedWorkouts[selectedWorkoutIndex].exercises.push(exercise)
    }

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
  };

  const handleEditWorkout = (index) => {
    const workout = workouts[index]
    setNewWorkoutName(workout.name)
    setEditingWorkoutIndex(index)
    setShowWorkoutPopup(true)
  }

  const handleDeleteWorkout = (index) => {
    const updated = workouts.filter((_, i) => i !== index)
    setWorkouts(updated)

    if (updated.length === 0) {
      setSelectedWorkoutIndex(null)
    } else if (index === setSelectedWorkoutIndex) {
      setSelectedWorkoutIndex(0)
    }
  }

  const handleEditExercise = (idx) => {
    const exercise = selectedWorkout.exercises[idx]
    setExerciseForm({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weights: [...exercise.weights],
      setsInput: exercise.sets,
      repsInput: exercise.reps,
    })
    setEditingExerciseIndex(idx)
    setShowExercisePopup(true)
  }

  const handleDeleteExercise = (idx) => {
    if (!selectedWorkout) return;
    const updatedExercises = selectedWorkout.exercises.filter((_, i) => i !== idx)
    const updatedWorkouts = workouts.map((w, i) => i === selectedWorkoutIndex ? {...w, exercises: updatedExercises } : w)
    setWorkouts(updatedWorkouts)
  }

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

    // Optionally mark workout as completed if storing in history
    const updatedWorkouts = [...workouts];
    updatedWorkouts[selectedWorkoutIndex] = { ...selectedWorkout, completed: true };
    setWorkouts(updatedWorkouts);

    // Save to workoutHistory
    const savedHistory = localStorage.getItem("workoutHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.push(updatedWorkouts[selectedWorkoutIndex]);
    localStorage.setItem("workoutHistory", JSON.stringify(history));

    navigate("/workout", { state: { workout: selectedWorkout } });
  };

  return (
    <div className="planning-container-bordered">
      {/* Start Button */}
      {selectedWorkout && selectedWorkout.exercises.length > 0 && (
        <button className="start-workout-btn" onClick={handleStartWorkout}>Start Workout</button>
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
            className={`exercise-item workout-item ${selectedWorkoutIndex === idx ? "selected" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px"
            }}
          >
            {/*DELETE BUTTON - Workouts*/}
            <button className="icon-btn delete-btn" 
            onClick={() => handleDeleteWorkout(idx)}>X</button>
              
            {/*Workout Name*/}
            <span onClick={() => setSelectedWorkoutIndex(idx)}
              style={{
                flexGrow: 1,
                cursor: "pointer"
              }}
            >{w.name}</span>
          
            {/*EDIT BUTTON - Workouts*/}
            <button className="icon-btn edit-btn" onClick={() => handleEditWorkout(idx)}>✏️</button>


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
            <div 
              key={idx} 
              className="exercise-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {/*DELETE BUTTON - Excercises*/}
              <button className="icon-btn delete-btn" onClick={() => handleDeleteExercise(idx)}>X</button>

              {/*EXERCISE NAME*/}
              <span
                style={{
                  flexGrow: 1,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedWorkoutIndex(selectedWorkoutIndex)}>{ex.name}</span>

              {/*EDIT BUTTON - Exercises*/}
              <button className="icon-btn edit-btn" onClick={() => handleEditExercise(idx)}>✏️</button>
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

Planning.propTypes = {
  workouts: PropTypes.array,
  setWorkouts: PropTypes.func,
}
