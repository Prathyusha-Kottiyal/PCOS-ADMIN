import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>({});

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes`;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        setRecipe(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      navigate("/recipes");
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <div>Loading...</div>;

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
        <h1 style={{ fontSize: 28, marginBottom: 24, color: "#333" }}>Edit Recipe</h1>

        {/* Input fields */}
        {[
          { label: "Title", value: recipe.title || "", key: "title" },
          { label: "Description", value: recipe.description || "", key: "description" },
          { label: "Image URL", value: recipe.image || "", key: "image" },
          { label: "Video URL", value: recipe.video || "", key: "video" },
          { label: "Tags (comma separated)", value: (recipe.tags || []).join(", "), key: "tags" },
          { label: "Prep Time", value: recipe.prepTime || "", key: "prepTime" },
          { label: "Cook Time", value: recipe.cookTime || "", key: "cookTime" },
        ].map((field) => (
          <input
            key={field.key}
            placeholder={field.label}
            value={field.value}
            onChange={(e) => {
              if (field.key === "tags") {
                setRecipe({ ...recipe, tags: e.target.value.split(",").map((t) => t.trim()) });
              } else {
                setRecipe({ ...recipe, [field.key]: e.target.value });
              }
            }}
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
          { label: "Ingredients (one per line)", value: (recipe.ingredients || []).join("\n"), key: "ingredients" },
          { label: "Steps (one per line)", value: (recipe.steps || []).join("\n"), key: "steps" },
        ].map((field) => (
          <textarea
            key={field.key}
            placeholder={field.label}
            value={field.value}
            onChange={(e) => setRecipe({ ...recipe, [field.key]: e.target.value.split("\n") })}
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
          Update Recipe
        </button>
      </div>
    </div>
  );
}
