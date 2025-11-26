import { useEffect, useState } from "react";
import "./Planning.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [sortField, setSortField] = useState(null); // "exercise" or "date"
  const [sortAscending, setSortAscending] = useState(true);

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

    // Sorting
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

  return (
    <div
      style={{
        overflowY: "auto",
        height: "calc(100vh - 60px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr",
          borderTop: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        {/* Headers */}
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
            onClick={header.field ? () => handleSort(header.field) : undefined}
            style={{
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              padding: "8px",
              fontWeight: "bold",
              background: header.field ? "#e0c3ff" : "#f9f9f9",
              color: "purple",
              textAlign: "center",
              cursor: header.field ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            {header.title}
            {header.field && sortField === header.field && (
              <span style={{ marginLeft: 4 }}>{sortAscending ? "▲" : "▼"}</span>
            )}
          </div>
        ))}

        {/* Data rows */}
        {exercisesList.map((ex, rowIdx) => (
          <>
            <div
              key={`${rowIdx}-name`}
              style={{
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {ex.name}
            </div>
            <div
              key={`${rowIdx}-date`}
              style={{
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {ex.dateString}
            </div>
            <div
              key={`${rowIdx}-sets`}
              style={{
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {ex.sets}
            </div>
            <div
              key={`${rowIdx}-reps`}
              style={{
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {ex.reps}
            </div>
            {ex.actualWeights.map((w, wIdx) => (
              <div
                key={`${rowIdx}-weight-${wIdx}`}
                style={{
                  borderRight: wIdx < 2 ? "1px solid black" : "none",
                  borderBottom: "1px solid black",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {w}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
