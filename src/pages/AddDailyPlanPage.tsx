import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDailyPlanPage() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [day, setDay] = useState(1);
  const [quote, setQuote] = useState("");

  const [recipes, setRecipes] = useState<any[]>([]);
  const [yogas, setYogas] = useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [selectedYogas, setSelectedYogas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch(`${API_URL}/recipes`);
      setRecipes((await r.json()).data || []);
      const y = await fetch(`${API_URL}/yoga`);
      setYogas((await y.json()).data || []);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    await fetch(`${API_URL}/dailyPlan`, {
      method: "POST",
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
          beforeBed: { recipes: [] }
        },
        workouts: selectedYogas.map(id => ({ workoutId: id }))
      })
    });
    navigate("/dailyPlan");
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Add Daily Plan</h1>
      <input type="number" value={day} onChange={(e) => setDay(parseInt(e.target.value))} placeholder="Day" />
      <input type="text" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote" />

      <h3>Select Recipes</h3>
      <select multiple value={selectedRecipes} onChange={(e) => setSelectedRecipes(Array.from(e.target.selectedOptions, option => option.value))}>
        {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
      </select>

      <h3>Select Yoga</h3>
      <select multiple value={selectedYogas} onChange={(e) => setSelectedYogas(Array.from(e.target.selectedOptions, option => option.value))}>
        {yogas.map(y => <option key={y._id} value={y._id}>{y.title}</option>)}
      </select>

      <button onClick={handleAdd} style={{ marginTop: 16 }}>Add Plan</button>
    </div>
  );
}
