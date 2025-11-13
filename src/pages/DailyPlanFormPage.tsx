import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// --- INTERFACES ---
interface Recipe {
  _id: string;
  title?: string;
  image?: string;
}

interface MealItem {
  title: string;
  recipes: string[]; // always store _id strings
  alternateRecipes?: string[];
  notes?: string;
}

interface SubVideo {
  title: string;
  workoutId: string; // always string
  duration?: string;
  notes?: string;
}

interface Workout {
  title: string;
  followAlongFullVideo: string; // always string
  subVideos: SubVideo[];
  notes?: string;
  _id?: string;
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

type FieldError = { [key: string]: string };

// --- STYLES ---
const styles = {
  container: { maxWidth: 900, margin: "40px auto", padding: 30, backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" },
  header: { color: "#333", borderBottom: "2px solid #007bff", paddingBottom: 10, marginBottom: 20 },
  label: { display: "block", fontWeight: "bold", marginBottom: 5, marginTop: 15, color: "#555" },
  input: { width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box" as "border-box" },
  error: { color: "#dc3545", fontSize: 14, marginTop: -8, marginBottom: 10 },
  sectionTitle: { color: "#007bff", borderLeft: "5px solid #007bff", paddingLeft: 10, marginTop: 30, marginBottom: 15 },
  itemGroup: { border: "1px solid #e9ecef", padding: 15, marginBottom: 15, borderRadius: 8, backgroundColor: "#f8f9fa" },
  button: { padding: "8px 15px", marginRight: 10, borderRadius: 6, border: "none", cursor: "pointer" },
  primaryButton: { backgroundColor: "#007bff", color: "#fff", fontWeight: "bold", marginTop: 20, minWidth: 150 },
  secondaryButton: { backgroundColor: "#6c757d", color: "#fff" },
  dangerButton: { backgroundColor: "#dc3545", color: "#fff", marginLeft: 10 },
  subItemGroup: { border: "1px dashed #ced4da", padding: 10, marginTop: 10, borderRadius: 6, backgroundColor: "#fff" },
  workoutGroup: { border: "1px solid #6c757d", padding: 20, marginBottom: 20, borderRadius: 10, backgroundColor: "#f0f0f0" },
};

// --- RECIPE PICKER ---
interface RecipePickerProps {
  recipes: Recipe[];
  onAdd: (recipe: Recipe) => void;
  onClose: () => void;
}

const RecipePicker: React.FC<RecipePickerProps> = ({ recipes, onAdd, onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const handleAdd = () => {
    if (!selectedRecipe) return;
    const recipeObj = recipes.find(r => r._id === selectedRecipe);
    if (recipeObj) onAdd(recipeObj);
    setSelectedRecipe("");
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, width: 400 }}>
        <h3>Select Recipe</h3>
        <select style={{ width: "100%", marginBottom: 10 }} value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
          <option value="">Select Recipe</option>
          {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
        </select>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleAdd} style={{ backgroundColor: "#28a745", color: "#fff", padding: "6px 12px", borderRadius: 4 }}>Add</button>
          <button onClick={onClose} style={{ backgroundColor: "#dc3545", color: "#fff", padding: "6px 12px", borderRadius: 4 }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DailyPlanFormPage({ mode }: { mode: "add" | "edit" }) {
  const { day: dayParam } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [day, setDay] = useState<number>(dayParam ? parseInt(dayParam) : 1);
  const [quote, setQuote] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [yogas, setYogas] = useState<Recipe[]>([]);
  const [meals, setMeals] = useState<Meals>({
    emptyStomach: [], breakfast: [], midMorning: [], lunch: [], evening: [], dinner: [], beforeBed: [],
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [errors, setErrors] = useState<FieldError>({});
  const [recipeModal, setRecipeModal] = useState<{ section: keyof Meals; index: number } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // --- FETCH DATA ---
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
  }, [API_URL]);

  useEffect(() => {
    if (mode === "edit" && day) {
      async function fetchPlan() {
        const res = await fetch(`${API_URL}/dailyPlan/${day}`);
        const data = await res.json();
        if (data.data) {
          setQuote(data.data.quote || "");

          // normalize meals to only store _id in recipes
          const normalizedMeals: Meals = {} as Meals;
          Object.keys(data.data.meals).forEach(section => {
            const key = section as keyof Meals;
            normalizedMeals[key] = data.data.meals[key].map((item: MealItem) => ({
              ...item,
              recipes: item.recipes.map((r: Recipe | string) => (typeof r === "string" ? r : r._id)),
              alternateRecipes: item.alternateRecipes?.map((r: Recipe | string) => (typeof r === "string" ? r : r._id)) || [],
            }));
          });
          setMeals(normalizedMeals);

          // normalize workouts safely
          const normalizedWorkouts: Workout[] = (data.data.workouts || []).map((w: Workout) => ({
            ...w,
            followAlongFullVideo:
              typeof w.followAlongFullVideo === "object" && w.followAlongFullVideo !== null
                ? (w.followAlongFullVideo as Recipe)._id
                : (w.followAlongFullVideo as string | undefined) || "",
            subVideos: w.subVideos.map(sv => ({
              ...sv,
              workoutId:
                typeof sv.workoutId === "object" && sv.workoutId !== null
                  ? (sv.workoutId as Recipe)._id
                  : (sv.workoutId as string | undefined) || "",
            })),
          }));
          setWorkouts(normalizedWorkouts);
        }
      }
      fetchPlan();
    }
  }, [mode, day, API_URL]);

  // --- MEAL HELPERS ---
  const updateMealItem = (section: keyof Meals, index: number, field: keyof MealItem, value: any) => {
    setMeals(prev => {
      const updated = { ...prev };
      if (!updated[section][index]) updated[section][index] = { title: "", recipes: [] };
      (updated[section][index] as any)[field] = value;
      return updated;
    });
  };

  const addMealItem = (section: keyof Meals) => {
    if (isAdding) return;
    setIsAdding(true);
    setMeals(prev => {
      const updated = { ...prev };
      updated[section].push({ title: "", recipes: [], alternateRecipes: [], notes: "" });
      return updated;
    });
    setTimeout(() => setIsAdding(false), 50);
  };

  const removeMealItem = (section: keyof Meals, index: number) => {
    setMeals(prev => {
      const updated = { ...prev };
      updated[section].splice(index, 1);
      return updated;
    });
  };

  const addRecipeToMeal = (recipe: Recipe) => {
    if (!recipeModal) return;
    const { section, index } = recipeModal;
    const currentRecipes = meals[section][index].recipes || [];
    updateMealItem(section, index, "recipes", [...currentRecipes, recipe._id]);
    setRecipeModal(null);
  };

  // --- WORKOUT HELPERS ---
  const updateWorkoutField = (index: number, field: keyof Workout, value: any) => {
    setWorkouts(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addWorkout = () => {
    if (isAdding) return;
    setIsAdding(true);
    setWorkouts(prev => [...prev, { title: "", followAlongFullVideo: "", subVideos: [], notes: "" }]);
    setTimeout(() => setIsAdding(false), 50);
  };

  const removeWorkout = (index: number) => {
    setWorkouts(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const addSubVideo = (wIndex: number) => {
    if (isAdding) return;
    setIsAdding(true);
    setWorkouts(prev => {
      const updated = [...prev];
      updated[wIndex].subVideos.push({ title: "", workoutId: "", duration: "", notes: "" });
      return updated;
    });
    setTimeout(() => setIsAdding(false), 50);
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
      updated[wIndex].subVideos[sIndex][field] = field === "workoutId" ? String(value) : value;
      return updated;
    });
  };

  // --- VALIDATION ---
  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!day || day < 1) newErrors.day = "Day must be >= 1";
    if (!quote || quote.trim() === "") newErrors.quote = "Quote is required";

    Object.keys(meals).forEach(section => {
      const items = meals[section as keyof Meals];
      items.forEach((item, idx) => {
        if (!item.title || item.title.trim() === "") newErrors[`meal-${section}-${idx}`] = "Meal title required";
        item.recipes.forEach((r: string, rIdx: number) => {
          if (!r || r.trim() === "") newErrors[`meal-${section}-${idx}-recipe-${rIdx}`] = "Recipe ID required";
        });
      });
    });

    workouts.forEach((w, wIdx) => {
      if (!w.title || w.title.trim() === "") newErrors[`workout-${wIdx}`] = "Workout title required";
      w.subVideos.forEach((sv, sIdx) => {
        if (!sv.title || sv.title.trim() === "") newErrors[`subvideo-title-${wIdx}-${sIdx}`] = "SubVideo title required";
        if (!sv.workoutId || sv.workoutId.trim() === "") newErrors[`subvideo-yoga-${wIdx}-${sIdx}`] = "Yoga selection required";
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const method = mode === "edit" ? "PUT" : "POST";
    const endpoint = mode === "edit" ? `${API_URL}/dailyPlan/${day}` : `${API_URL}/dailyPlan`;

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, meals, workouts, quote }),
    });
    navigate("/dailyPlan");
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{mode === "edit" ? "✏️ Edit Daily Plan" : "➕ Add Daily Plan"}</h1>

      {/* Day & Quote */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>
            Day:
            <input type="number" style={styles.input} value={day} onChange={e => setDay(parseInt(e.target.value))} />
            {errors.day && <div style={styles.error}>{errors.day}</div>}
          </label>
        </div>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>
            Quote:
            <input type="text" style={styles.input} value={quote} onChange={e => setQuote(e.target.value)} />
            {errors.quote && <div style={styles.error}>{errors.quote}</div>}
          </label>
        </div>
      </div>

      <hr style={{ borderTop: "1px dashed #ced4da", margin: "30px 0" }} />

      {/* MEALS */}
      <h2 style={{ ...styles.sectionTitle, borderLeftColor: "#28a745" }}>🍽️ Daily Meals</h2>
      {Object.keys(meals).map(section => {
        const key = section as keyof Meals;
        return (
          <div key={key} style={{ marginTop: 20 }}>
            <h3 style={{ color: "#28a745", marginBottom: 10 }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            {meals[key].map((item, index) => (
              <div key={index} style={styles.itemGroup}>
                <input style={styles.input} placeholder="Meal Title" value={item.title} onChange={e => updateMealItem(key, index, "title", e.target.value)} />
                {errors[`meal-${key}-${index}`] && <div style={styles.error}>{errors[`meal-${key}-${index}`]}</div>}

                <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => setRecipeModal({ section: key, index })}>➕ Add Recipe</button>

                {item.recipes && item.recipes.length > 0 && (
                  <ul style={{ marginTop: 5 }}>
                    {item.recipes.map((r, idx) => {
                      const rObj = recipes.find(x => x._id === r);
                      return <li key={idx}>{rObj?.title || "Unknown Recipe"}</li>;
                    })}
                  </ul>
                )}

                <input style={styles.input} placeholder="Notes" value={item.notes || ""} onChange={e => updateMealItem(key, index, "notes", e.target.value)} />
                <button onClick={() => removeMealItem(key, index)} style={{ ...styles.button, ...styles.dangerButton }}>Remove Meal</button>
              </div>
            ))}
            <button onClick={e => { e.preventDefault(); addMealItem(key); }} style={{ ...styles.button, ...styles.secondaryButton, marginTop: 5 }} disabled={isAdding}>
              ➕ Add {key.replace(/([A-Z])/g, ' $1')}
            </button>
          </div>
        );
      })}

      <hr style={{ borderTop: "1px dashed #ced4da", margin: "30px 0" }} />

      {/* WORKOUTS */}
      <h2 style={{ ...styles.sectionTitle, borderLeftColor: "#17a2b8" }}>🏋️‍♀️ Workouts</h2>
      {workouts.map((w, wIdx) => (
        <div key={wIdx} style={styles.workoutGroup}>
          <input style={styles.input} placeholder="Workout Title" value={w.title} onChange={e => updateWorkoutField(wIdx, "title", e.target.value)} />
          {errors[`workout-${wIdx}`] && <div style={styles.error}>{errors[`workout-${wIdx}`]}</div>}

          <select
            style={styles.input}
            value={String(w.followAlongFullVideo || "")} // <-- fix TS
            onChange={e => updateWorkoutField(wIdx, "followAlongFullVideo", e.target.value)}
          >
            <option value="">Select Yoga Video</option>
            {yogas.map(y => <option key={y._id} value={y._id}>{y.title}</option>)}
          </select>

          {/* SubVideos */}
          {w.subVideos.map((sv, sIdx) => (
            <div key={sIdx} style={styles.subItemGroup}>
              <input style={styles.input} placeholder="SubVideo Title" value={sv.title} onChange={e => updateSubVideoField(wIdx, sIdx, "title", e.target.value)} />
              {errors[`subvideo-title-${wIdx}-${sIdx}`] && <div style={styles.error}>{errors[`subvideo-title-${wIdx}-${sIdx}`]}</div>}

              <select style={styles.input} value={String(sv.workoutId || "")} onChange={e => updateSubVideoField(wIdx, sIdx, "workoutId", e.target.value)}>
                <option value="">Select Yoga</option>
                {yogas.map(y => <option key={y._id} value={y._id}>{y.title}</option>)}
              </select>
              {errors[`subvideo-yoga-${wIdx}-${sIdx}`] && <div style={styles.error}>{errors[`subvideo-yoga-${wIdx}-${sIdx}`]}</div>}

              <input style={styles.input} placeholder="Notes" value={sv.notes || ""} onChange={e => updateSubVideoField(wIdx, sIdx, "notes", e.target.value)} />
              <button onClick={() => removeSubVideo(wIdx, sIdx)} style={{ ...styles.button, ...styles.dangerButton }}>Remove SubVideo</button>
            </div>
          ))}
          <button onClick={() => addSubVideo(wIdx)} style={{ ...styles.button, ...styles.secondaryButton }}>➕ Add SubVideo</button>
          <button onClick={() => removeWorkout(wIdx)} style={{ ...styles.button, ...styles.dangerButton }}>Remove Workout</button>
        </div>
      ))}
      <button onClick={addWorkout} style={{ ...styles.button, ...styles.primaryButton }}>➕ Add Workout</button>

      <hr style={{ borderTop: "1px dashed #ced4da", margin: "30px 0" }} />

      <button onClick={handleSubmit} style={{ ...styles.button, ...styles.primaryButton }}>{mode === "edit" ? "Update Plan" : "Create Plan"}</button>

      {/* Recipe Modal */}
      {recipeModal && <RecipePicker recipes={recipes} onAdd={addRecipeToMeal} onClose={() => setRecipeModal(null)} />}
    </div>
  );
}
