import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  tags: string[];
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [tags, setTags] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes`; // replace with your endpoint

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log(data,'data')
      setRecipes(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  console.log(recipes,'recipes')

  // Add new recipe
  const addRecipe = async () => {
    if (!title || !description || !prepTime || !cookTime || ingredients.length === 0 || steps.length === 0) {
      alert("Please fill all required fields!");
      return;
    }
    try {
      const res = await fetch(API_URL, {
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
      if (res.ok) {
        resetForm();
        fetchRecipes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setVideo("");
    setTags("");
    setPrepTime("");
    setCookTime("");
    setIngredients([]);
    setSteps([]);
  };

  // Edit recipe
  const editRecipe = async (recipe: Recipe) => {
    const newTitle = prompt("Edit title", recipe.title);
    if (!newTitle) return;

    const newDescription = prompt("Edit description", recipe.description) || "";
    try {
      await fetch(`${API_URL}/${recipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recipe,
          title: newTitle,
          description: newDescription,
        }),
      });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Recipes Admin</h1>

      <div style={{ marginBottom: "24px", display: "grid", gap: "8px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Video URL"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Prep Time"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Cook Time"
          value={cookTime}
          onChange={(e) => setCookTime(e.target.value)}
          style={{ padding: "8px" }}
        />
        <textarea
          placeholder="Ingredients (one per line)"
          value={ingredients.join("\n")}
          onChange={(e) => setIngredients(e.target.value.split("\n"))}
          style={{ padding: "8px" }}
        ></textarea>
        <textarea
          placeholder="Steps (one per line)"
          value={steps.join("\n")}
          onChange={(e) => setSteps(e.target.value.split("\n"))}
          style={{ padding: "8px" }}
        ></textarea>
        <button onClick={addRecipe} style={{ padding: "12px", backgroundColor: "#f97316", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Add Recipe
        </button>
      </div>

      {recipes?.map((r) => (
        <RecipeCard
          key={r.id}
          id={r.id}
          title={r.title}
          description={r.description}
          onEdit={() => editRecipe(r)}
          onDelete={() => deleteRecipe(r.id)}
        />
      ))}
    </div>
  );
}
