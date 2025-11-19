// src/Pages/History.jsx
import { useEffec, useState } from "react";

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
      <h2>History Page</h2>
      <p>View your workout history here.</p>
    </div>
  );
}
