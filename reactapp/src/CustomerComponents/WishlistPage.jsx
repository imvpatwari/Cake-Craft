import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLoader } from "../Components/LoaderContext.jsx";

const DEFAULT_IMAGE =
  "https://plus.unsplash.com/premium_photo-1676793356846-26be2a54c594?q=80&w=1025&auto=format&fit=crop";

export default function WishlistPage() {
  const { setLoading } = useLoader();
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");
  let userId = null;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload["UserId"];
    }
  } catch {
    userId = null;
  }

  const fetchWishlist = async () => {
    try {
      if (!token || !userId) return;
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/cakes/wishlist?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data || []);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cakeId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${API_BASE_URL}/cakes/wishlist/remove?userId=${userId}&cakeId=${cakeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm("Clear your wishlist?")) return;
    try {
      setLoading(true);
      await axios.delete(
        `${API_BASE_URL}/cakes/wishlist/clear?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="main-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Wishlist</h3>
        {items.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={clearWishlist}>
            Clear All
          </button>
        )}
      </div>

      <div className="card-grid">
        {items.map((cake) => (
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
            <p className="mb-2">Qty: {cake.quantity} Kg</p>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => removeItem(cake.cakeId)}
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && <p>Your wishlist is empty.</p>}
      </div>
    </div>
  );
}