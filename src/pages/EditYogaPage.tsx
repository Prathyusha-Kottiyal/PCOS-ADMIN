import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Yoga {
  title: string;
  description: string;
  image: string;
  duration: string;
  youtubeId: string;
  instructions: string[];
  notes: string; // string, not array
  isPeriodFriendly: boolean;
}

export default function EditYogaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [yoga, setYoga] = useState<Yoga>({
    title: "",
    description: "",
    image: "",
    duration: "",
    youtubeId: "",
    instructions: [],
    notes: "",
    isPeriodFriendly: false,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/yoga`;

  useEffect(() => {
    const fetchYoga = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();

        setYoga({
          title: data.data.title || "",
          description: data.data.description || "",
          image: data.data.image || "",
          duration: data.data.duration || "",
          youtubeId: data.data.youtubeId || "",
          instructions: Array.isArray(data.data.instructions) ? data.data.instructions : [],
          notes: data.data.notes || "",
          isPeriodFriendly: data.data.isPeriodFriendly || false,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24, color: "#333" }}>Edit Yoga Workout</h1>

      {/* Single-line inputs */}
      {[
        { label: "Title", value: yoga.title, setter: (val: string) => setYoga({ ...yoga, title: val }) },
        { label: "Description", value: yoga.description, setter: (val: string) => setYoga({ ...yoga, description: val }) },
        { label: "Image URL", value: yoga.image, setter: (val: string) => setYoga({ ...yoga, image: val }) },
        { label: "Duration", value: yoga.duration, setter: (val: string) => setYoga({ ...yoga, duration: val }) },
        { label: "YouTube ID", value: yoga.youtubeId, setter: (val: string) => setYoga({ ...yoga, youtubeId: val }) },
      ].map((field) => (
        <input
          key={field.label}
          placeholder={field.label}
          value={field.value}
          onChange={(e) => field.setter(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
      ))}

      {/* Instructions (array) */}
      <textarea
        placeholder="Instructions (one per line)"
        value={yoga.instructions.join("\n")}
        onChange={(e) => setYoga({ ...yoga, instructions: e.target.value.split("\n") })}
        style={{
          width: "100%",
          padding: "12px 16px",
          marginBottom: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          minHeight: 100,
          resize: "vertical",
        }}
      />

      {/* Notes (string) */}
      <textarea
        placeholder="Notes"
        value={yoga.notes}
        onChange={(e) => setYoga({ ...yoga, notes: e.target.value })}
        style={{
          width: "100%",
          padding: "12px 16px",
          marginBottom: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          minHeight: 80,
          resize: "vertical",
        }}
      />

      {/* Checkbox */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 16, color: "#555", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={yoga.isPeriodFriendly}
            onChange={(e) => setYoga({ ...yoga, isPeriodFriendly: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          Period Friendly
        </label>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        style={{
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#f97316",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
      >
        Update Workout
      </button>
    </div>
  );
}
