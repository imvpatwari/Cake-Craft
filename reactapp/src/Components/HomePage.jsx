import React from "react";
import CountUp from "react-countup";

export default function HomePage() {
  const stats = [
    { label: "Cakes", value: 120 },
    { label: "Pastries", value: 80 },
    { label: "Donuts", value: 45 },
    { label: "Breads", value: 65 },
  ];

  return (
    <div className="main-container">
      <h2 className="mb-3">Welcome to CakeCraft 🎂</h2>
      <p className="text-muted mb-4">
        Whether you are a baker or a cake lover, manage and explore delightful desserts in one place.
      </p>
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="card text-center shadow-sm" style={{ borderRadius: "1rem" }}>
              <div className="card-body">
                <h3 className="fw-bold">
                  <CountUp end={s.value} duration={2} />+
                </h3>
                <p className="mb-0 text-muted">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p>
        Use the navigation above to manage cakes if you are a <b>Baker</b>, or browse and wishlist cakes as a{" "}
        <b>Customer</b>.
      </p>
    </div>
  );
}