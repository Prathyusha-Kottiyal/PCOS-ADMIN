// ...existing code...
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

// --- STYLES (updated for horizontal layouts) ---
const styles = {
  container: {
    maxWidth: 1200,
    margin: "32px auto",
    padding: 28,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    color: "#0f172a",
  },
  header: {
    color: "#0f172a",
    borderBottom: "2px solid rgba(99,102,241,0.12)",
    paddingBottom: 12,
    marginBottom: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, margin: 0, fontWeight: 600 },
  headerActions: { display: "flex", gap: 8 },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
    fontSize: 13,
  },

  // meta row uses grid so Day + Quote align nicely
  metaRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 16,
    alignItems: "start",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 6,
    border: "1px solid #e6eef8",
    borderRadius: 8,
    boxSizing: "border-box" as "border-box",
    fontSize: 14,
  },
  error: { color: "#dc3545", fontSize: 13, marginTop: 6 },

  // Meals grid: 3 columns on wide screens, wrap on narrow
  mealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
  mealCard: {
    background: "#ffffff",
    borderRadius: 10,
    padding: 12,
    border: "1px solid #eef2ff",
    boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
  },
  mealCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  // each meal item uses internal grid: title | recipes(select) | notes
  mealItemRow: {
    display: "grid",
    gridTemplateColumns: "1fr 160px 1fr",
    gap: 10,
    alignItems: "start",
  },
  mealItemStack: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fbfdff",
    border: "1px solid #eef2ff",
  },
  smallSelect: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e6eef8",
    fontSize: 13,
  },

  // workouts area arranged in columns for better space usage
  workoutsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    alignItems: "start",
  },
  workoutCard: {
    background: "#fff",
    borderRadius: 10,
    padding: 12,
    border: "1px solid #e6eef8",
  },
  subItemGroup: {
    border: "1px dashed #ced4da",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  // buttons / actions
  button: {
    padding: "8px 12px",
    marginRight: 8,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  primaryButton: {
    backgroundColor: "linear-gradient(90deg,#6d28d9,#7c3aed)" as any,
    color: "#fff",
  },
  secondaryButton: { backgroundColor: "#eef2ff", color: "#3730a3" },
  dangerButton: { backgroundColor: "#fee2e2", color: "#b91c1c" },

  actionsRow: {
    marginTop: 12,
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },

  // responsive helper for single column fallback
  fullWidthOnMobile: { gridColumn: "1 / -1" as any },
};

// --- RECIPE PICKER ---
interface RecipePickerProps {
  recipes: Recipe[];
  onAdd: (recipe: Recipe) => void;
  onClose: () => void;
}

const RecipePicker: React.FC<RecipePickerProps> = ({
  recipes,
  onAdd,
  onClose,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const handleAdd = () => {
    if (!selectedRecipe) return;
    const recipeObj = recipes.find((r) => r._id === selectedRecipe);
    if (recipeObj) onAdd(recipeObj);
    setSelectedRecipe("");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 60,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 8,
          width: 440,
          boxShadow: "0 12px 40px rgba(2,6,23,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Select Recipe</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        <select
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e6eef8",
            marginBottom: 12,
          }}
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
        >
          <option value="">Select Recipe</option>
          {recipes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={handleAdd}
            style={{
              ...styles.button,
              backgroundColor: "#10b981",
              color: "#fff",
            }}
          >
            Add
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.dangerButton }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DailyPlanFormPage({ mode }: { mode: "add" | "edit" }) {
  const { day: dayParam } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [day, setDay] = useState<number>(dayParam ? parseInt(dayParam) : 1);
  const [quote, setQuote] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [yogas, setYogas] = useState<Recipe[]>([]);
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
  const [errors, setErrors] = useState<FieldError>({});
  const [recipeModal, setRecipeModal] = useState<{
    section: keyof Meals;
    index: number;
  } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
          Object.keys(data.data.meals).forEach((section) => {
            const key = section as keyof Meals;
            normalizedMeals[key] = data.data.meals[key].map(
              (item: MealItem) => ({
                ...item,
                recipes: item.recipes.map((r: Recipe | string) =>
                  typeof r === "string" ? r : r._id
                ),
                alternateRecipes:
                  item.alternateRecipes?.map((r: Recipe | string) =>
                    typeof r === "string" ? r : r._id
                  ) || [],
              })
            );
          });
          setMeals(normalizedMeals);

          // normalize workouts safely
          const normalizedWorkouts: Workout[] = (data.data.workouts || []).map(
            (w: Workout) => ({
              ...w,
              followAlongFullVideo:
                typeof w.followAlongFullVideo === "object" &&
                w.followAlongFullVideo !== null
                  ? (w.followAlongFullVideo as Recipe)._id
                  : (w.followAlongFullVideo as string | undefined) || "",
              subVideos: w.subVideos.map((sv) => ({
                ...sv,
                workoutId:
                  typeof sv.workoutId === "object" && sv.workoutId !== null
                    ? (sv.workoutId as Recipe)._id
                    : (sv.workoutId as string | undefined) || "",
              })),
            })
          );
          setWorkouts(normalizedWorkouts);
        }
      }
      fetchPlan();
    }
  }, [mode, day, API_URL]);

  const updateMealItem = (
    section: keyof Meals,
    index: number,
    field: keyof MealItem,
    value: any
  ) => {
    setMeals((prev) => {
      const updated = { ...prev };
      if (!updated[section][index])
        updated[section][index] = { title: "", recipes: [] };
      (updated[section][index] as any)[field] = value;
      return updated;
    });
  };

  const addMealItem = useCallback(
    (section: keyof Meals) => {
      if (isAdding) return;
      setIsAdding(true);
      setMeals((prev) => {
        const updated = { ...prev };
        updated[section].push({
          title: "",
          recipes: [],
          alternateRecipes: [],
          notes: "",
        });
        return updated;
      });
      setTimeout(() => setIsAdding(false), 50);
    },
    [isAdding]
  );

  const removeMealItem = (section: keyof Meals, index: number) => {
    setMeals((prev) => {
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
  const updateWorkoutField = (
    index: number,
    field: keyof Workout,
    value: any
  ) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addWorkout = () => {
    if (isAdding) return;
    setIsAdding(true);
    setWorkouts((prev) => [
      ...prev,
      { title: "", followAlongFullVideo: "", subVideos: [], notes: "" },
    ]);
    setTimeout(() => setIsAdding(false), 50);
  };

  const removeWorkout = (index: number) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const addSubVideo = (wIndex: number) => {
    if (isAdding) return;
    setIsAdding(true);
    setWorkouts((prev) => {
      const updated = [...prev];
      updated[wIndex].subVideos.push({
        title: "",
        workoutId: "",
        duration: "",
        notes: "",
      });
      return updated;
    });
    setTimeout(() => setIsAdding(false), 50);
  };

  const removeSubVideo = (wIndex: number, sIndex: number) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      updated[wIndex].subVideos.splice(sIndex, 1);
      return updated;
    });
  };

  const updateSubVideoField = (
    wIndex: number,
    sIndex: number,
    field: keyof SubVideo,
    value: any
  ) => {
    setWorkouts((prev) => {
      const updated = [...prev];
      updated[wIndex].subVideos[sIndex][field] =
        field === "workoutId" ? String(value) : value;
      return updated;
    });
  };

  // --- VALIDATION ---
  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!day || day < 1) newErrors.day = "Day must be >= 1";
    if (!quote || quote.trim() === "") newErrors.quote = "Quote is required";

    Object.keys(meals).forEach((section) => {
      const items = meals[section as keyof Meals];
      items.forEach((item, idx) => {
        if (!item.title || item.title.trim() === "")
          newErrors[`meal-${section}-${idx}`] = "Meal title required";
        item.recipes.forEach((r: string, rIdx: number) => {
          if (!r || r.trim() === "")
            newErrors[`meal-${section}-${idx}-recipe-${rIdx}`] =
              "Recipe ID required";
        });
      });
    });

    workouts.forEach((w, wIdx) => {
      if (!w.title || w.title.trim() === "")
        newErrors[`workout-${wIdx}`] = "Workout title required";
      w.subVideos.forEach((sv, sIdx) => {
        if (!sv.title || sv.title.trim() === "")
          newErrors[`subvideo-title-${wIdx}-${sIdx}`] =
            "SubVideo title required";
        if (!sv.workoutId || sv.workoutId.trim() === "")
          newErrors[`subvideo-yoga-${wIdx}-${sIdx}`] =
            "Yoga selection required";
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const method = mode === "edit" ? "PUT" : "POST";
    const endpoint =
      mode === "edit" ? `${API_URL}/dailyPlan/${day}` : `${API_URL}/dailyPlan`;

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
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            {mode === "edit" ? "✏️ Edit Daily Plan" : "➕ Add Daily Plan"}
          </h1>
          <div style={{ color: "#6b7280", marginTop: 4 }}>
            Design a balanced day — meals, workouts and notes.
          </div>
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={() => navigate("/dailyPlan")}
            style={{ ...styles.button, backgroundColor: "#f3f4f6" }}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              backgroundColor: "#6d28d9",
              color: "#fff",
            }}
          >
            {mode === "edit" ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Day & Quote */}
      <div style={styles.metaRow}>
        <div>
          <label style={styles.label}>Day</label>
          <input
            type="number"
            min={1}
            style={styles.input}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value || "1"))}
          />
          {errors.day && <div style={styles.error}>{errors.day}</div>}
        </div>

        <div>
          <label style={styles.label}>Quote</label>
          <input
            type="text"
            style={styles.input}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="A short motivational quote"
          />
          {errors.quote && <div style={styles.error}>{errors.quote}</div>}
        </div>
      </div>

      <hr style={{ borderTop: "1px dashed #e6eef8", margin: "20px 0" }} />

      {/* MEALS */}
      <h2 style={{ color: "#10b981", marginBottom: 12 }}>🍽️ Daily Meals</h2>
      <div style={styles.mealsGrid}>
        {Object.keys(meals).map((section) => {
          const key = section as keyof Meals;
          return (
            <div key={key} style={styles.mealCard}>
              <div style={styles.mealCardHeader}>
                <strong style={{ textTransform: "capitalize" }}>
                  {key.replace(/([A-Z])/g, " $1")}
                </strong>
                <button
                  onClick={() => addMealItem(key)}
                  style={{
                    ...styles.button,
                    backgroundColor: "#eef2ff",
                    color: "#3730a3",
                  }}
                >
                  + Add
                </button>
              </div>

              {meals[key].length === 0 && (
                <div style={{ color: "#6b7280", fontSize: 13 }}>
                  No items. Click "Add" to create one.
                </div>
              )}

              {meals[key].map((item, index) => (
                <div key={index} style={styles.mealItemStack}>
                  <div>
                    <div>
                      <label style={styles.label}>Title</label>
                      <input
                        style={styles.input}
                        placeholder="Meal Title"
                        value={item.title}
                        onChange={(e) =>
                          updateMealItem(key, index, "title", e.target.value)
                        }
                      />
                      {errors[`meal-${key}-${index}`] && (
                        <div style={styles.error}>
                          {errors[`meal-${key}-${index}`]}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={styles.label}>Recipes</label>

                      {/* NEW: show selected recipes as chips; removal updates the meal.recipes array */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          padding:10,
                          alignItems: "center",
                        }}
                      >
                        {(item.recipes || []).map((rid: string) => {
                          const r = recipes.find((rr) => rr._id === rid);
                          return (
                            <div
                              key={rid}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                borderRadius: 999,
                                background: "#f1f5f9",
                                fontSize: 13,
                              }}
                            >
                              <span
                                style={{
                                  maxWidth: 160,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {r?.title || rid}
                              </span>
                              <button
                                onClick={() => {
                                  const next = (item.recipes || []).filter(
                                    (x: string) => x !== rid
                                  );
                                  updateMealItem(key, index, "recipes", next);
                                }}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                                aria-label={`Remove recipe ${r?.title || rid}`}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        {/* hint when empty */}
                        {(item.recipes || []).length === 0 && (
                          <div style={{ color: "#6b7280", fontSize: 13 }}>
                            No recipes selected — use "Add from list".
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={styles.label}>Notes</label>
                      <input
                        style={styles.input}
                        placeholder="Notes"
                        value={item.notes || ""}
                        onChange={(e) =>
                          updateMealItem(key, index, "notes", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13 }}>
                      {item.recipes?.length
                        ? `${item.recipes.length} recipe(s)`
                        : "No recipes selected"}
                    </div>
                    <div style={{display:'flex', flexDirection:'row'}}>
                      <button
                        onClick={() => setRecipeModal({ section: key, index })}
                        style={{
                          ...styles.button,
                          backgroundColor: "#06b6d4",
                          color: "#fff",
                        }}
                      >
                        Add 
                      </button>
                      <button
                        onClick={() => removeMealItem(key, index)}
                        style={{ ...styles.button, ...styles.dangerButton }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <hr style={{ borderTop: "1px dashed #e6eef8", margin: "26px 0" }} />

      {/* WORKOUTS */}
      <h2 style={{ color: "#06b6d4", marginBottom: 12 }}>🏋️ Workouts</h2>
      <div style={{ ...styles.workoutsGrid }}>
        {workouts.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              color: "#6b7280",
              padding: 12,
              borderRadius: 8,
              border: "1px dashed #e6eef8",
            }}
          >
            No workouts yet — add one to start building the day's routine.
          </div>
        )}

        {workouts.map((w, wIdx) => (
          <div key={wIdx} style={styles.workoutCard}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              placeholder="Workout title"
              value={w.title}
              onChange={(e) =>
                updateWorkoutField(wIdx, "title", e.target.value)
              }
            />
            {errors[`workout-${wIdx}`] && (
              <div style={styles.error}>{errors[`workout-${wIdx}`]}</div>
            )}

            <label style={styles.label}>Full Video</label>
            <select
              style={styles.input}
              value={String(w.followAlongFullVideo || "")}
              onChange={(e) =>
                updateWorkoutField(wIdx, "followAlongFullVideo", e.target.value)
              }
            >
              <option value="">Select</option>
              {yogas.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.title}
                </option>
              ))}
            </select>

            {w.subVideos.map((sv, sIdx) => (
              <div key={sIdx} style={styles.subItemGroup}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>SubVideo Title</label>
                    <input
                      style={styles.input}
                      placeholder="Title"
                      value={sv.title}
                      onChange={(e) =>
                        updateSubVideoField(wIdx, sIdx, "title", e.target.value)
                      }
                    />
                    {errors[`subvideo-title-${wIdx}-${sIdx}`] && (
                      <div style={styles.error}>
                        {errors[`subvideo-title-${wIdx}-${sIdx}`]}
                      </div>
                    )}
                  </div>

                  <div style={{ width: 160 }}>
                    <label style={styles.label}>Yoga</label>
                    <select
                      style={{ ...styles.smallSelect, width: "100%" }}
                      value={String(sv.workoutId || "")}
                      onChange={(e) =>
                        updateSubVideoField(
                          wIdx,
                          sIdx,
                          "workoutId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select</option>
                      {yogas.map((y) => (
                        <option key={y._id} value={y._id}>
                          {y.title}
                        </option>
                      ))}
                    </select>
                    {errors[`subvideo-yoga-${wIdx}-${sIdx}`] && (
                      <div style={styles.error}>
                        {errors[`subvideo-yoga-${wIdx}-${sIdx}`]}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Duration"
                    value={sv.duration || ""}
                    onChange={(e) =>
                      updateSubVideoField(
                        wIdx,
                        sIdx,
                        "duration",
                        e.target.value
                      )
                    }
                  />
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Notes"
                    value={sv.notes || ""}
                    onChange={(e) =>
                      updateSubVideoField(wIdx, sIdx, "notes", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeSubVideo(wIdx, sIdx)}
                    style={{ ...styles.button, ...styles.dangerButton }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <button
                onClick={() => addSubVideo(wIdx)}
                style={{
                  ...styles.button,
                  backgroundColor: "#eef2ff",
                  color: "#3730a3",
                }}
              >
                + Add SubVideo
              </button>
              <div>
                <button
                  onClick={() => removeWorkout(wIdx)}
                  style={{ ...styles.button, ...styles.dangerButton }}
                >
                  Remove Workout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.actionsRow}>
        <button
          onClick={addWorkout}
          style={{
            ...styles.button,
            backgroundColor: "#10b981",
            color: "#fff",
          }}
        >
          + Add Workout
        </button>
      </div>

      <hr style={{ borderTop: "1px dashed #e6eef8", margin: "26px 0" }} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={() => navigate("/dailyPlan")}
          style={{ ...styles.button, backgroundColor: "#f3f4f6" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            ...styles.button,
            backgroundColor: "#6d28d9",
            color: "#fff",
          }}
        >
          {mode === "edit" ? "Update Plan" : "Create Plan"}
        </button>
      </div>

      {/* Recipe Modal */}
      {recipeModal && (
        <RecipePicker
          recipes={recipes}
          onAdd={addRecipeToMeal}
          onClose={() => setRecipeModal(null)}
        />
      )}
    </div>
  );
}
// ...existing code...
