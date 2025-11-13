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

      // Assuming backend returns total count for pagination (otherwise approximate)
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
      fetchPlans(); // refresh list
    } catch (err) {
      console.error("Error deleting daily plan:", err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Daily Plans</h1>
      <button onClick={() => navigate("/dailyPlan/add")}>Add Daily Plan</button>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Quote</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan._id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{plan.day}</td>
              <td>{plan.quote}</td>
              <td>
                <button onClick={() => navigate(`/dailyPlan/edit/${plan.day}`)}>Edit</button>
                <button onClick={() => handleDelete(plan._id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: "0 12px" }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
