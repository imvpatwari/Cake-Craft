import React from "react";

export default function Modal({ show, title, message, onClose }) {
  if (!show) return null;
  return (
    <div className="loader-overlay" style={{ background: "rgba(0,0,0,0.35)" }}>
      <div className="loader-box" style={{ maxWidth: 360, textAlign: "center" }}>
        <h5 className="mb-2">{title}</h5>
        <p className="mb-3">{message}</p>
        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}