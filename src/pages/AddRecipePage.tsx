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

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes`;

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
      navigate("/recipes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: "#333" }}>Add Recipe</h1>

        {/* Input fields */}
        {[
          { label: "Title", value: title, setter: setTitle },
          { label: "Description", value: description, setter: setDescription },
          { label: "Image URL", value: image, setter: setImage },
          { label: "Video URL", value: video, setter: setVideo },
          { label: "Tags (comma separated)", value: tags, setter: setTags },
          { label: "Prep Time", value: prepTime, setter: setPrepTime },
          { label: "Cook Time", value: cookTime, setter: setCookTime },
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

        {/* Textareas */}
        {[
          { label: "Ingredients (one per line)", value: ingredients.join("\n"), setter: setIngredients },
          { label: "Steps (one per line)", value: steps.join("\n"), setter: setSteps },
        ].map((field) => (
          <textarea
            key={field.label}
            placeholder={field.label}
            value={field.value}
            onChange={(e) => field.setter(e.target.value.split("\n"))}
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
        ))}

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
          Add Recipe
        </button>
      </div>
    </div>
  );
}
