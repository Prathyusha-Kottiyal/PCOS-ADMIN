import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

interface Recipe {
  _id: string;
  title: string;
  description: string;
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes`;

  const fetchRecipes = async (page: number) => {
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
      const data = await res.json();
      setRecipes(data.data);
      // Optional: if your backend sends total count, calculate total pages
      if (data.totalCount) setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  console.log(recipes)

  const deleteRecipe = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchRecipes(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Recipes</h1>
      <Link to="/recipes/add">
        <button style={{ marginBottom: "16px", padding: "8px 16px", backgroundColor: "#f97316", color: "#fff" }}>Add Recipe</button>
      </Link>

      {recipes.map((r) => (
        <RecipeCard
          key={r._id}
          id={r._id}
          title={r.title}
          description={r.description}
          onEdit={() => window.location.assign(`/recipes/edit/${r._id}`)}
          onDelete={() => deleteRecipe(r._id)}
        />
      ))}

      {/* Pagination */}
      <div style={{ marginTop: "16px" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ marginRight: "8px" }}>
          Previous
        </button>
        <span>Page {page}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ marginLeft: "8px" }}>
          Next
        </button>
      </div>
    </div>
  );
}
