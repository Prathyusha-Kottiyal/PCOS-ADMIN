import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditYogaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [yoga, setYoga] = useState<any>({});

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/yoga`;

  useEffect(() => {
    const fetchYoga = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        setYoga(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchYoga();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yoga),
      });
      navigate("/yoga");
    } catch (err) {
      console.error(err);
    }
  };

  if (!yoga) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Edit Yoga Workout</h1>
      <input placeholder="Title" value={yoga.title || ""} onChange={(e) => setYoga({ ...yoga, title: e.target.value })} />
      <input placeholder="Description" value={yoga.description || ""} onChange={(e) => setYoga({ ...yoga, description: e.target.value })} />
      <input placeholder="Image URL" value={yoga.image || ""} onChange={(e) => setYoga({ ...yoga, image: e.target.value })} />
      <input placeholder="Duration" value={yoga.duration || ""} onChange={(e) => setYoga({ ...yoga, duration: e.target.value })} />
      <input placeholder="YouTube ID" value={yoga.youtubeId || ""} onChange={(e) => setYoga({ ...yoga, youtubeId: e.target.value })} />
      <textarea placeholder="Instructions (one per line)" value={(yoga.instructions || []).join("\n")} onChange={(e) => setYoga({ ...yoga, instructions: e.target.value.split("\n") })}></textarea>
      <textarea placeholder="Notes" value={yoga.notes || ""} onChange={(e) => setYoga({ ...yoga, notes: e.target.value })}></textarea>
      <label>
        <input type="checkbox" checked={yoga.isPeriodFriendly || false} onChange={(e) => setYoga({ ...yoga, isPeriodFriendly: e.target.checked })} /> Period Friendly
      </label>
      <button onClick={handleUpdate} style={{ marginTop: 16, padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>Update Workout</button>
    </div>
  );
}
