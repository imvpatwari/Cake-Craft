import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLoader } from "../Components/LoaderContext.jsx";

const DEFAULT_IMAGE =
  "https://plus.unsplash.com/premium_photo-1676793356846-26be2a54c594?q=80&w=1025&auto=format&fit=crop";

export default function CustomerViewCake() {
  const { setLoading } = useLoader();
  const [cakes, setCakes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("Sort & Filter ▼");

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

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/cakes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCakes(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Error fetching cakes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (!token || !userId) return;
      const res = await axios.get(
        `${API_BASE_URL}/cakes/wishlist?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ids = (res.data || []).map((w) => w.cakeId);
      setWishlist(ids);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchCakes();
    fetchWishlist();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const term = value.toLowerCase();
    const list = cakes.filter(
      (cake) =>
        (cake.name || "").toLowerCase().includes(term) ||
        (cake.category || "").toLowerCase().includes(term)
    );
    setFiltered(list);
  };

  const clearSearch = () => {
    setSearch("");
    setFiltered(cakes);
  };

  const sortByPrice = (order) => {
    const sorted = [...filtered].sort((a, b) =>
      order === "high" ? b.price - a.price : a.price - b.price
    );
    setFiltered(sorted);
    setSelectedOption(order === "high" ? "Price: High to Low" : "Price: Low to High");
  };

  const filterByCategory = (category) => {
    const filteredList = cakes.filter((cake) => cake.category === category);
    setFiltered(filteredList);
    setSelectedOption(`Category: ${category}`);
  };

  const resetFilters = () => {
    setFiltered(cakes);
    setSelectedOption("Sort & Filter ▼");
  };

  const handleWishlistClick = async (cakeId) => {
    if (!token) {
      alert("Please login to add to wishlist");
      return;
    }
    const isFav = wishlist.includes(cakeId);
    const prev = [...wishlist];
    isFav
      ? setWishlist(prev.filter((id) => id !== cakeId))
      : setWishlist([...prev, cakeId]);

    try {
      if (!isFav) {
        await axios.post(
          `${API_BASE_URL}/cakes/wishlist/add?userId=${userId}&cakeId=${cakeId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `${API_BASE_URL}/cakes/wishlist/remove?userId=${userId}&cakeId=${cakeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Wishlist API error:", err);
      alert("Could not update wishlist");
      setWishlist(prev);
    }
  };

  return (
    <div className="main-container">
      <h2 className="mb-3">Available Cakes</h2>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Cakes"
            className="search-input"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-sm btn-link" onClick={clearSearch}>
              ✖
            </button>
          )}
        </div>

        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            {selectedOption}
          </button>
          <ul className="dropdown-menu">
            <li className="dropdown-item" onClick={() => filterByCategory("Cake")}>
              Category: Cake
            </li>
            <li className="dropdown-item" onClick={() => filterByCategory("Bread")}>
              Category: Bread
            </li>
            <li className="dropdown-item" onClick={() => filterByCategory("Donuts")}>
              Category: Donuts
            </li>
            <li className="dropdown-item" onClick={() => filterByCategory("Pastry")}>
              Category: Pastry
            </li>
            <li className="dropdown-item" onClick={() => filterByCategory("Cookies")}>
              Category: Cookies
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-item" onClick={() => sortByPrice("high")}>
              Price: High to Low
            </li>
            <li className="dropdown-item" onClick={() => sortByPrice("low")}>
              Price: Low to High
            </li>
            <li className="dropdown-item" onClick={resetFilters}>
              Reset Filters
            </li>
          </ul>
        </div>
      </div>

      <div className="card-grid">
        {filtered.map((cake) => (
          <div className="cake-card" key={cake.cakeId}>
            <div className="d-flex justify-content-end">
              <span
                className="wishlist-icon"
                onClick={() => handleWishlistClick(cake.cakeId)}
              >
                {wishlist.includes(cake.cakeId) ? "❤️" : "🤍"}
              </span>
            </div>
            <img
              src={cake.cakeImage || DEFAULT_IMAGE}
              alt={cake.name}
              className="cake-image"
              onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
            />
            <h5>{cake.name}</h5>
            <p className="text-muted mb-1">{cake.category}</p>
            <p className="mb-1">₹{cake.price}</p>
            <p className="mb-0">Qty: {cake.quantity} Kg</p>
          </div>
        ))}
        {filtered.length === 0 && <p>No cakes found.</p>}
      </div>
    </div>
  );
}