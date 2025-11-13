import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditDailyPlanPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [day, setDay] = useState<number>(1);
  const [quote, setQuote] = useState<string>("");

  const [recipes, setRecipes] = useState<any[]>([]);
  const [yogas, setYogas] = useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [selectedYogas, setSelectedYogas] = useState<string[]>([]);

  // Fetch all recipes and yoga for selection
  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch(`${API_URL}/recipes`);
      setRecipes((await r.json()).data || []);

      const y = await fetch(`${API_URL}/yoga`);
      setYogas((await y.json()).data || []);
    };
    fetchData();
  }, []);

  // Fetch existing daily plan
  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch(`${API_URL}/dailyPlan/${id}`);
      const data = await res.json();
      if (data.data) {
        setDay(data.data.day);
        setQuote(data.data.quote);

        // Pre-select breakfast recipes
        setSelectedRecipes(
          data.data.meals.breakfast.recipes.map((r: any) => r._id)
        );

        // Pre-select workouts
        const workoutIds = data.data.workouts.map((w: any) => {
          if (w.subVideos?.length) return w.subVideos[0].workoutId._id;
          return w._id;
        });
        setSelectedYogas(workoutIds);
      }
    };
    if (id) fetchPlan();
  }, [id]);

  // Handle update
  const handleUpdate = async () => {
    await fetch(`${API_URL}/dailyPlan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day,
        quote,
        meals: {
          breakfast: { recipes: selectedRecipes },
          lunch: { recipes: [] },
          dinner: { recipes: [] },
          midMorning: { recipes: [] },
          emptyStomach: { recipes: [] },
          beforeBed: { recipes: [] },
        },
        workouts: selectedYogas.map((yId) => ({ workoutId: yId })),
      }),
    });
    navigate("/dailyPlan");
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Edit Daily Plan</h1>

      <label>
        Day:
        <input
          type="number"
          value={day}
          onChange={(e) => setDay(parseInt(e.target.value))}
        />
      </label>

      <label>
        Quote:
        <input
          type="text"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </label>

      <h3>Select Recipes</h3>
      <select
        multiple
        value={selectedRecipes}
        onChange={(e) =>
          setSelectedRecipes(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
        style={{ width: "100%", height: 150 }}
      >
        {recipes.map((r) => (
          <option key={r._id} value={r._id}>
            {r.title}
          </option>
        ))}
      </select>

      <h3>Select Yoga</h3>
      <select
        multiple
        value={selectedYogas}
        onChange={(e) =>
          setSelectedYogas(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
        style={{ width: "100%", height: 150 }}
      >
        {yogas.map((y) => (
          <option key={y._id} value={y._id}>
            {y.title}
          </option>
        ))}
      </select>

      <button onClick={handleUpdate} style={{ marginTop: 16 }}>
        Update Plan
      </button>
    </div>
  );
}
