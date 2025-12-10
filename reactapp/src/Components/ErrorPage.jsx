import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h1 className="mb-3">Oops!</h1>
      <p className="mb-4 text-muted">You are not allowed to access this page or it does not exist.</p>
      <button className="btn btn-primary" onClick={() => navigate("/home")}>
        Go to Home
      </button>
    </div>
  );
}