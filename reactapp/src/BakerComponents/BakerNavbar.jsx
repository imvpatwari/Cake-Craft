import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BakerNavbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("bakerName") || "Baker";

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand">CakeCraft - Baker</span>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary-subtle text-primary-emphasis badge-role">
            {name}
          </span>
          <Link to="/baker/cakes" className="btn btn-link">
            Cakes
          </Link>
          <Link to="/baker/add-cake" className="btn btn-link">
            Add Cake
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}