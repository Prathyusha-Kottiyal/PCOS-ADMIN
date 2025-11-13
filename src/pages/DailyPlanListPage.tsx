import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DailyPlan {
  _id: string;
  day: number;
  quote?: string;
}

export default function DailyPlanListPage() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_URL}/dailyPlan?page=${page}&limit=${limit}`);
      const data = await res.json();
      setPlans(data.data || []);
      if (data.totalCount) setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (err) {
      console.error("Error fetching daily plans:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, limit]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this daily plan?")) return;
    try {
      await fetch(`${API_URL}/dailyPlan/${id}`, { method: "DELETE" });
      fetchPlans();
    } catch (err) {
      console.error("Error deleting daily plan:", err);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, color: "#333" }}>Daily Plans</h1>
        <button
          onClick={() => navigate("/dailyPlan/add")}
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
          + Add Daily Plan
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th style={{ padding: "10px 12px", color: "#555" }}>Day</th>
            <th style={{ padding: "10px 12px", color: "#555" }}>Quote</th>
            <th style={{ padding: "10px 12px", color: "#555" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr
              key={plan._id}
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: 6,
                marginBottom: 8,
                display: "table-row",
              }}
            >
              <td style={{ padding: "12px" }}>{plan.day}</td>
              <td style={{ padding: "12px" }}>{plan.quote || "-"}</td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => navigate(`/dailyPlan/edit/${plan.day}`)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#4ade80",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f87171",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24, gap: 12 }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            padding: "8px 16px",
            backgroundColor: page === 1 ? "#ccc" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 600, color: "#333" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{
            padding: "8px 16px",
            backgroundColor: page === totalPages ? "#ccc" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
