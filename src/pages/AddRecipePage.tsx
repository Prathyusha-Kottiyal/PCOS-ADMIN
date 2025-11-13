import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [tags, setTags] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes"`;

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
          video,
          tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
          prepTime,
          cookTime,
          ingredients,
          steps,
        }),
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Add Recipe</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <input placeholder="Video URL" value={video} onChange={(e) => setVideo(e.target.value)} />
      <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <input placeholder="Prep Time" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
      <input placeholder="Cook Time" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
      <textarea placeholder="Ingredients (one per line)" value={ingredients.join("\n")} onChange={(e) => setIngredients(e.target.value.split("\n"))}></textarea>
      <textarea placeholder="Steps (one per line)" value={steps.join("\n")} onChange={(e) => setSteps(e.target.value.split("\n"))}></textarea>
      <button onClick={handleAdd} style={{ marginTop: "16px", padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>
        Add Recipe
      </button>
    </div>
  );
}
