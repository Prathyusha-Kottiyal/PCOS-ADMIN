import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface MealItem {
  title: string;
  recipes: string[];
  alternateRecipes?: string[];
  notes?: string;
}

interface SubVideo {
  title: string;
  workoutId: string;
  duration?: string;
  notes?: string;
}

interface Workout {
  title: string;
  followAlongFullVideo?: string;
  subVideos: SubVideo[];
  notes?: string;
}

interface Meals {
  emptyStomach: MealItem[];
  breakfast: MealItem[];
  midMorning: MealItem[];
  lunch: MealItem[];
  evening: MealItem[];
  dinner: MealItem[];
  beforeBed: MealItem[];
}

export default function DailyPlanFormPage({ mode }: { mode: "add" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [day, setDay] = useState<number>(1);
  const [quote, setQuote] = useState<string>("");

  const [recipes, setRecipes] = useState<any[]>([]);
  const [yogas, setYogas] = useState<any[]>([]);

  const [meals, setMeals] = useState<Meals>({
    emptyStomach: [],
    breakfast: [],
    midMorning: [],
    lunch: [],
    evening: [],
    dinner: [],
    beforeBed: [],
  });

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch Recipes & Yoga
  useEffect(() => {
    async function fetchData() {
      const r = await fetch(`${API_URL}/recipes`);
      const rData = await r.json();
      setRecipes(rData.data || []);

      const y = await fetch(`${API_URL}/yoga`);
      const yData = await y.json();
      setYogas(yData.data || []);
    }
    fetchData();
  }, []);

  // Fetch existing plan if editing
  useEffect(() => {
    if (mode === "edit" && id) {
      async function fetchPlan() {
        const res = await fetch(`${API_URL}/dailyPlan/${id}`);
        const data = await res.json();
        if (data.data) {
          setDay(data.data.day);
          setQuote(data.data.quote || "");
          setMeals(data.data.meals);
          setWorkouts(data.data.workouts || []);
        }
      }
      fetchPlan();
    }
  }, [mode, id]);

  // --- Helpers for Meals ---
  const updateMealItem = (section: keyof Meals, index: number, field: keyof MealItem, value: any) => {
    setMeals(prev => {
      const updated = { ...prev };
      if (!updated[section][index]) updated[section][index] = { title: "", recipes: [] };
      updated[section][index][field] = value;
      return updated;
    });
  };

  const addMealItem = (section: keyof Meals) => {
    setMeals(prev => {
      const updated = { ...prev };
      updated[section].push({ title: "", recipes: [], alternateRecipes: [], notes: "" });
      return updated;
    });
  };

  const removeMealItem = (section: keyof Meals, index: number) => {
    setMeals(prev => {
      const updated = { ...prev };
      updated[section].splice(index, 1);
      return updated;
    });
  };

  // --- Helpers for Workouts ---
  const updateWorkoutField = (index: number, field: keyof Workout, value: any) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addWorkout = () => {
    setWorkouts(prev => [...prev, { title: "", followAlongFullVideo: "", subVideos: [], notes: "" }]);
  };

  const removeWorkout = (index: number) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const addSubVideo = (wIndex: number) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated[wIndex].subVideos.push({ title: "", workoutId: "", duration: "", notes: "" });
      return updated;
    });
  };

  const removeSubVideo = (wIndex: number, sIndex: number) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated[wIndex].subVideos.splice(sIndex, 1);
      return updated;
    });
  };

  const updateSubVideoField = (wIndex: number, sIndex: number, field: keyof SubVideo, value: any) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated[wIndex].subVideos[sIndex][field] = value;
      return updated;
    });
  };

  // --- Validation ---
  const validate = () => {
    const errs: string[] = [];
    if (!day || day < 1) errs.push("Day must be >= 1");
    if (!quote || quote.trim() === "") errs.push("Quote is required");

    meals && Object.keys(meals).forEach(section => {
      const items = meals[section as keyof Meals];
      items.forEach((item, idx) => {
        if (!item.title || item.title.trim() === "") errs.push(`${section} #${idx + 1} title required`);
      });
    });

    workouts.forEach((w, wIdx) => {
      if (!w.title || w.title.trim() === "") errs.push(`Workout #${wIdx + 1} title required`);
      w.subVideos.forEach((sv, sIdx) => {
        if (!sv.title || sv.title.trim() === "") errs.push(`Workout #${wIdx + 1} SubVideo #${sIdx + 1} title required`);
        if (!sv.workoutId || sv.workoutId.trim() === "") errs.push(`Workout #${wIdx + 1} SubVideo #${sIdx + 1} yoga selection required`);
      });
    });

    setErrors(errs);
    return errs.length === 0;
  };

  // --- Submit handler ---
  const handleSubmit = async () => {
    if (!validate()) return;

    const method = mode === "edit" ? "PUT" : "POST";
    const endpoint = mode === "edit" ? `${API_URL}/dailyPlan/${id}` : `${API_URL}/dailyPlan`;

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, meals, workouts, quote }),
    });
    navigate("/dailyPlan");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>{mode === "edit" ? "Edit Daily Plan" : "Add Daily Plan"}</h1>

      {errors.length > 0 && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <label>
        Day:
        <input type="number" value={day} onChange={e => setDay(parseInt(e.target.value))} />
      </label>

      <label>
        Quote:
        <input type="text" value={quote} onChange={e => setQuote(e.target.value)} />
      </label>

      {/* Meals */}
      {Object.keys(meals).map(section => {
        const key = section as keyof Meals;
        return (
          <div key={key} style={{ marginTop: 16 }}>
            <h3>{key.toUpperCase()}</h3>
            {meals[key].map((item, index) => (
              <div key={index} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
                <input
                  placeholder="Meal Title"
                  value={item.title}
                  onChange={e => updateMealItem(key, index, "title", e.target.value)}
                />
                <select
                  multiple
                  value={item.recipes}
                  onChange={e =>
                    updateMealItem(key, index, "recipes", Array.from(e.target.selectedOptions, o => o.value))
                  }
                >
                  {recipes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
                <select
                  multiple
                  value={item.alternateRecipes || []}
                  onChange={e =>
                    updateMealItem(key, index, "alternateRecipes", Array.from(e.target.selectedOptions, o => o.value))
                  }
                >
                  {recipes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
                <input
                  placeholder="Notes"
                  value={item.notes}
                  onChange={e => updateMealItem(key, index, "notes", e.target.value)}
                />
                <button onClick={() => removeMealItem(key, index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addMealItem(key)}>Add {key}</button>
          </div>
        );
      })}

      {/* Workouts */}
      <div style={{ marginTop: 24 }}>
        <h2>Workouts</h2>
        {workouts.map((w, wIndex) => (
          <div key={wIndex} style={{ border: "1px solid #000", padding: 12, marginBottom: 12 }}>
            <input
              placeholder="Workout Title"
              value={w.title}
              onChange={e => updateWorkoutField(wIndex, "title", e.target.value)}
            />
            <select
              value={w.followAlongFullVideo || ""}
              onChange={e => updateWorkoutField(wIndex, "followAlongFullVideo", e.target.value)}
            >
              <option value="">Select Full Workout</option>
              {yogas.map(y => (
                <option key={y._id} value={y._id}>{y.title}</option>
              ))}
            </select>

            {w.subVideos.map((sv, sIndex) => (
              <div key={sIndex} style={{ marginTop: 8, border: "1px solid #ccc", padding: 8 }}>
                <input
                  placeholder="SubVideo Title"
                  value={sv.title}
                  onChange={e => updateSubVideoField(wIndex, sIndex, "title", e.target.value)}
                />
                <select
                  value={sv.workoutId}
                  onChange={e => updateSubVideoField(wIndex, sIndex, "workoutId", e.target.value)}
                >
                  <option value="">Select Yoga</option>
                  {yogas.map(y => (
                    <option key={y._id} value={y._id}>{y.title}</option>
                  ))}
                </select>
                <input
                  placeholder="Duration"
                  value={sv.duration}
                  onChange={e => updateSubVideoField(wIndex, sIndex, "duration", e.target.value)}
                />
                <input
                  placeholder="Notes"
                  value={sv.notes}
                  onChange={e => updateSubVideoField(wIndex, sIndex, "notes", e.target.value)}
                />
                <button onClick={() => removeSubVideo(wIndex, sIndex)}>Remove SubVideo</button>
              </div>
            ))}
            <button onClick={() => addSubVideo(wIndex)}>Add SubVideo</button>
            <input
              placeholder="Workout Notes"
              value={w.notes}
              onChange={e => updateWorkoutField(wIndex, "notes", e.target.value)}
            />
            <button onClick={() => removeWorkout(wIndex)}>Remove Workout</button>
          </div>
        ))}
        <button onClick={addWorkout}>Add Workout</button>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 24 }}>
        {mode === "edit" ? "Update Daily Plan" : "Add Daily Plan"}
      </button>
    </div>
  );
}
