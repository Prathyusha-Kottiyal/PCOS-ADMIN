import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const sections = [
    {
      label: "Yoga Workouts",
      description: "Explore and manage yoga exercises for all levels.",
      path: "/yoga",
      color: "#f97316",
    },
    {
      label: "Recipes",
      description: "Browse and add healthy recipes tailored for you.",
      path: "/recipes",
      color: "#10b981",
    },
    {
      label: "Daily Plans",
      description: "View and manage your daily plans and routines.",
      path: "/dailyPlan",
      color: "#3b82f6",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 32, color: "#111827" }}>
        Welcome to Your Wellness Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {sections.map((section) => (
          <div
            key={section.label}
            onClick={() => navigate(section.path)}
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "32px 24px",
              flex: "1 1 250px",
              maxWidth: "300px",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget;
              el.style.transform = "translateY(-6px)";
              el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: section.color,
                margin: "0 auto 16px",
              }}
            />
            <h2 style={{ fontSize: 20, marginBottom: 12, color: "#111827" }}>
              {section.label}
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280" }}>{section.description}</p>
            <button
              style={{
                marginTop: 16,
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: section.color,
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#00000020")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = section.color)}
            >
              Go
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
