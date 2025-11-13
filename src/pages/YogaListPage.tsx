import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Yoga {
  _id: string;
  title: string;
  description: string;
}

export default function YogaListPage() {
  const [yogas, setYogas] = useState<Yoga[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/yoga`;

  const fetchYogas = async (page: number) => {
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
      const data = await res.json();
      setYogas(data.data);
      if (data.totalCount) setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchYogas(page);
  }, [page]);

  const deleteYoga = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchYogas(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Yoga Workouts</h1>
      <Link to="/yoga/add">
        <button style={{ marginBottom: 16, padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>
          Add Workout
        </button>
      </Link>

      {yogas.map((y) => (
        <div key={y._id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
          <h3>{y.title}</h3>
          <p>{y.description}</p>
          <button onClick={() => window.location.assign(`/yoga/edit/${y._id}`)}>Edit</button>
          <button onClick={() => deleteYoga(y._id)} style={{ marginLeft: 8 }}>Delete</button>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span style={{ margin: "0 8px" }}>Page {page}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
