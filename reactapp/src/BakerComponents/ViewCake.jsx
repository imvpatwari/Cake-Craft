import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLoader } from "../Components/LoaderContext.jsx";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://plus.unsplash.com/premium_photo-1676793356846-26be2a54c594?q=80&w=1025&auto=format&fit=crop";

export default function ViewCake() {
  const [cakes, setCakes] = useState([]);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/cakes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCakes(res.data || []);
    } catch (err) {
      console.error("Error fetching cakes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cake?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/cakes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCakes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete cake");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Cakes</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/baker/add-cake")}
        >
          Add New Cake
        </button>
      </div>

      <div className="card-grid">
        {cakes.map((cake) => (
          <div className="cake-card" key={cake.cakeId}>
            <img
              src={cake.cakeImage || DEFAULT_IMAGE}
              alt={cake.name}
              className="cake-image"
              onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
            />
            <h5>{cake.name}</h5>
            <p className="text-muted mb-1">{cake.category}</p>
            <p className="mb-1">₹{cake.price}</p>
            <p className="mb-2">Qty: {cake.quantity}</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(`/baker/edit-cake/${cake.cakeId}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(cake.cakeId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {cakes.length === 0 && <p>No cakes found.</p>}
      </div>
    </div>
  );
}