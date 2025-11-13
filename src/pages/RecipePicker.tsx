import React, { useState } from "react";

interface RecipePickerProps {
  recipes: any[];
  onAdd: (recipeId: string, time?: string) => void;
  onClose: () => void;
}

export const RecipePicker: React.FC<RecipePickerProps> = ({ recipes, onAdd, onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const handleAdd = () => {
    if (!selectedRecipe) return;
    onAdd(selectedRecipe, time);
    setSelectedRecipe("");
    setTime("");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8, width: 400 }}>
        <h3>Select Recipe</h3>
        <select style={{ width: "100%", marginBottom: 10 }} value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
          <option value="">Select Recipe</option>
          {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
        </select>
        <input style={{ width: "100%", marginBottom: 10 }} placeholder="Time / Quantity" value={time} onChange={e => setTime(e.target.value)} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleAdd} style={{ backgroundColor: "#28a745", color: "white", padding: "6px 12px", borderRadius: 4 }}>Add</button>
          <button onClick={onClose} style={{ backgroundColor: "#dc3545", color: "white", padding: "6px 12px", borderRadius: 4 }}>Close</button>
        </div>
      </div>
    </div>
  );
};
