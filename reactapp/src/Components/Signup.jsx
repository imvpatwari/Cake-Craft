import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLoader } from "./LoaderContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const [form, setForm] = useState({
    Email: "",
    Password: "",
    Username: "",
    MobileNumber: "",
    UserRole: "Customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/register`, form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 480, width: "100%", borderRadius: "1.5rem" }}>
        <h2 className="mb-4 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="Email" type="email" className="form-control" value={form.Email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="Password" type="password" className="form-control" value={form.Password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="Username" className="form-control" value={form.Username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input name="MobileNumber" className="form-control" value={form.MobileNumber} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select name="UserRole" className="form-select" value={form.UserRole} onChange={handleChange}>
              <option value="Customer">Customer</option>
              <option value="Baker">Baker</option>
            </select>
          </div>
          <button className="btn btn-primary w-100 mb-3" type="submit">
            Signup
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}