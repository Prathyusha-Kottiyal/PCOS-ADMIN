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
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Recipe</h1>
      <input placeholder="Title" value={recipe.title || ""} onChange={(e) => setRecipe({ ...recipe, title: e.target.value })} />
      <input placeholder="Description" value={recipe.description || ""} onChange={(e) => setRecipe({ ...recipe, description: e.target.value })} />
      <input placeholder="Image URL" value={recipe.image || ""} onChange={(e) => setRecipe({ ...recipe, image: e.target.value })} />
      <input placeholder="Video URL" value={recipe.video || ""} onChange={(e) => setRecipe({ ...recipe, video: e.target.value })} />
      <input placeholder="Tags (comma separated)" value={(recipe.tags || []).join(", ")} onChange={(e) => setRecipe({ ...recipe, tags: e.target.value.split(",").map(t => t.trim()) })} />
      <input placeholder="Prep Time" value={recipe.prepTime || ""} onChange={(e) => setRecipe({ ...recipe, prepTime: e.target.value })} />
      <input placeholder="Cook Time" value={recipe.cookTime || ""} onChange={(e) => setRecipe({ ...recipe, cookTime: e.target.value })} />
      <textarea placeholder="Ingredients (one per line)" value={(recipe.ingredients || []).join("\n")} onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value.split("\n") })}></textarea>
      <textarea placeholder="Steps (one per line)" value={(recipe.steps || []).join("\n")} onChange={(e) => setRecipe({ ...recipe, steps: e.target.value.split("\n") })}></textarea>

      <button onClick={handleUpdate} style={{ marginTop: "16px", padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>
        Update Recipe
      </button>
    </div>
  );
}
