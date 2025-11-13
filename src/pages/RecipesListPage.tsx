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
      if (data.totalCount) setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

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
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, color: "#333" }}>Recipes</h1>
        <Link to="/recipes/add">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add Recipe
          </button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
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
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 24,
          gap: 12,
        }}
      >
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: page <= 1 ? "#ccc" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: page <= 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 600, color: "#333" }}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: page >= totalPages ? "#ccc" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: page >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
