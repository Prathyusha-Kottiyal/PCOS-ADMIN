import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddYogaPage() {
  const navigate = useNavigate();

  // States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [youtubeId, setYoutubeId] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>(""); // string
  const [isPeriodFriendly, setIsPeriodFriendly] = useState<boolean>(false);

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/yoga`;

  const handleAdd = async () => {
    if (!title || !description) return alert("Title and description required");

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image,
          duration,
          youtubeId,
          instructions,
          notes,
          isPeriodFriendly,
        }),
      });
      navigate("/yoga");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ backgroundColor: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: 28, marginBottom: 24, color: "#333" }}>Add Yoga Workout</h1>

        {/* Single-line inputs */}
        {[
          { label: "Title", value: title, setter: setTitle },
          { label: "Description", value: description, setter: setDescription },
          { label: "Image URL", value: image, setter: setImage },
          { label: "Duration", value: duration, setter: setDuration },
          { label: "YouTube ID", value: youtubeId, setter: setYoutubeId },
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
          value={instructions.join("\n")}
          onChange={(e) => setInstructions(e.target.value.split("\n"))}
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
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
              checked={isPeriodFriendly}
              onChange={(e) => setIsPeriodFriendly(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Period Friendly
          </label>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
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
          Add Workout
        </button>
      </div>
    </div>
  );
}
