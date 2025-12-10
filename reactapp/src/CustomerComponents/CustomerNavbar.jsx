import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("customerName") || "Customer";

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand">CakeCraft - Customer</span>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success-emphasis badge-role">
            {name}
          </span>
          <Link to="/customer/cakes" className="btn btn-link">
            Cakes
          </Link>
          <Link to="/customer/wishlist" className="btn btn-link">
            Wishlist
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}