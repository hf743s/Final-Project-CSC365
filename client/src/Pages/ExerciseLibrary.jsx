import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

export default function ExerciseLibrary({ workouts, setWorkouts, selectedWorkoutIndex }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch exercises from ExerciseDB
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://exercisedb.p.rapidapi.com/exercises", {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.cde4b54feamsh2f2769ed0e80834p11753ajsn5fdb4246bb2,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch exercises");
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises()
  }, [])

  // Filtered exercises based on search
  const filteredExercises = useCallback(() => {
    return exercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [exercises, searchTerm]);

  const handleAddExercise = (exercise) => {
    if (selectedWorkoutIndex === null) return;
    const updatedWorkouts = [...workouts];
    updatedWorkouts[selectedWorkoutIndex].exercises.push({
      name: exercise.name,
      sets: 3, // default, user can edit in Planning
      reps: 10, // default
      weights: Array(3).fill(""), 
    })

    setWorkouts(updatedWorkouts)
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  if (loading) return <div>Loading exercises…</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Exercise Library</h2>
      <input
        type="text"
        placeholder="Search exercises…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {filteredExercises().map((ex) => (
          <div
            key={ex.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <div>
              <strong>{ex.name}</strong> — {ex.bodyPart} — {ex.target}
            </div>
            <button onClick={() => handleAddExercise(ex)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

ExerciseLibrary.propTypes = {
  workouts: PropTypes.array.isRequired,
  setWorkouts: PropTypes.func.isRequired,
  selectedWorkoutIndex: PropTypes.number,
};   

