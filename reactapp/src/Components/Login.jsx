import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLoader } from "./LoaderContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      email: !email ? "Email is required" : "",
      password: !password ? "Password is required" : "",
    });

    if (!email || !password) return;

    const payload = { Email: email, Password: password };

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const token = res.data?.token;
      if (!token) {
        alert("Invalid login");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role ||
        decoded.roles?.[0];

      localStorage.setItem("role", role);

      const username =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.email ||
        decoded.sub ||
        "User";

      if (role === "Baker") localStorage.setItem("bakerName", username);
      if (role === "Customer") localStorage.setItem("customerName", username);

      navigate("/home", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ maxWidth: 900, width: "100%", borderRadius: "1.5rem" }}>
        <div className="row g-0">
          <div className="col-md-6 p-5 bg-light">
            <h1 className="fw-bold mb-3">CakeCraft</h1>
            <p className="text-muted">
              Unleash your dessert dreams! Browse and manage stunning cakes for every occasion.
            </p>
            <img
              src="https://freedesignfile.com/image/preview/47328/ice-cream-cake-vector.png"
              alt="cake"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="col-md-6 p-5">
            <h2 className="mb-4">Welcome back 👋</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
            </form>
            <p className="text-muted">
              Don't have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>
                Signup
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}