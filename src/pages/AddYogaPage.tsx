import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddYogaPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isPeriodFriendly, setIsPeriodFriendly] = useState(false);

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
          isPeriodFriendly
        }),
      });
      navigate("/yoga");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Add Yoga Workout</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <input placeholder="YouTube ID" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} />
      <textarea placeholder="Instructions (one per line)" value={instructions.join("\n")} onChange={(e) => setInstructions(e.target.value.split("\n"))}></textarea>
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      <label>
        <input type="checkbox" checked={isPeriodFriendly} onChange={(e) => setIsPeriodFriendly(e.target.checked)} /> Period Friendly
      </label>
      <button onClick={handleAdd} style={{ marginTop: 16, padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>Add Workout</button>
    </div>
  );
}
