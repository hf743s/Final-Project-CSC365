import { useEffect, useState } from "react";
import "./history.css";
import useLocalStorage from "../Hooks/useLocalStorage";
import PropTypes from "prop-types";

export default function History() {
  const [history, setHistory] = useLocalStorage("history", []);
  const [sortField, setSortField] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const getExercisesList = () => {
    const exercisesList = history.flatMap((workout) =>
      (workout.exercises || []).map((ex) => {
        const repsArray = (ex.actualReps || []).map(Number).filter(r => !isNaN(r));
        const repsDisplay =
          repsArray.length === 0
            ? "-"
            : Math.min(...repsArray) === Math.max(...repsArray)
            ? `${Math.min(...repsArray)}`
            : `${Math.min(...repsArray)}-${Math.max(...repsArray)}`;

        return {
          name: ex.name || "-",
          date: workout.date ? new Date(workout.date) : null,
          dateString: workout.date ? new Date(workout.date).toLocaleDateString() : "-",
          sets: ex.sets ?? "-",
          reps: repsDisplay,
          actualWeights: [
            ex.weights?.[0] ?? "-",
            ex.weights?.[1] ?? "-",
            ex.weights?.[2] ?? "-",
          ],
        };
      })
    );

    if (sortField === "exercise") {
      exercisesList.sort((a, b) =>
        sortAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (sortField === "date") {
      exercisesList.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return sortAscending ? a.date - b.date : b.date - a.date;
      });
    }

    return exercisesList;
  };

  const exercisesList = getExercisesList();
  const filteredExerciseList = exercisesList.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍Search exercises or workouts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="history-grid">
        {[ 
          { title: "Exercise", field: "exercise" },
          { title: "Date", field: "date" },
          { title: "Sets" },
          { title: "Reps" },
          { title: "Actual Weight 1" },
          { title: "Actual Weight 2" },
          { title: "Actual Weight 3" },
        ].map((header, idx) => (
          <div
            key={idx}
            className={`history-header ${header.field ? "sortable" : ""}`}
            onClick={header.field ? () => handleSort(header.field) : undefined}
          >
            {header.title}
            {header.field && sortField === header.field && (
              <span>{sortAscending ? "▲" : "▼"}</span>
            )}
          </div>
        ))}

        {filteredExerciseList.map((ex, rowIdx) => (
          <>
            <div key={`${rowIdx}-name`} className="history-cell">{ex.name}</div>
            <div key={`${rowIdx}-date`} className="history-cell">{ex.dateString}</div>
            <div key={`${rowIdx}-sets`} className="history-cell">{ex.sets}</div>
            <div key={`${rowIdx}-reps`} className="history-cell">{ex.reps}</div>
            {ex.actualWeights.map((w, wIdx) => (
              <div key={`${rowIdx}-weight-${wIdx}`} className="history-cell">{w}</div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

History.propTypes = {
  history: PropTypes.array,
  setHistory: PropTypes.func,
};
