import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipesListPage from "./pages/RecipesListPage";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";

import YogaListPage from "./pages/YogaListPage";
import AddYogaPage from "./pages/AddYogaPage";
import EditYogaPage from "./pages/EditYogaPage";

import DailyList from "./pages/DailyPlanListPage";
import AddDailyData from "./pages/AddDailyPlanPage";
import EditDailyData from "./pages/EditDailyPlanPage";
import DailyPlanFormPage from "./pages/DailyPlanFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipesListPage />} />
        <Route path="/recipes/add" element={<AddRecipePage />} />
        <Route path="/recipes/edit/:id" element={<EditRecipePage />} />
        <Route path="/yoga" element={<YogaListPage />} />
        <Route path="/yoga/add" element={<AddYogaPage />} />
        <Route path="/yoga/edit/:id" element={<EditYogaPage />} />

        <Route path="/yoga" element={<YogaListPage />} />
        <Route path="/yoga/add" element={<AddYogaPage />} />
        <Route path="/yoga/edit/:id" element={<EditYogaPage />} />

        <Route path="/dailyplan" element={<DailyList />} />
        <Route path="/dailyplan/add" element={<DailyPlanFormPage mode="add"/>} />
        <Route path="/dailyplan/edit/:id" element={<DailyPlanFormPage mode="edit"/>} />
      </Routes>
    </BrowserRouter>
  );
}
