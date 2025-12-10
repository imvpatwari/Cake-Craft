import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { useLoader } from "../Components/LoaderContext.jsx";
import Modal from "../Components/Modal.jsx";

const DEFAULT_IMAGE =
  "https://plus.unsplash.com/premium_photo-1676793356846-26be2a54c594?q=80&w=1025&auto=format&fit=crop";

export default function CakeForm() {
  const [formData, setFormData] = useState({
    Name: "",
    Category: "Cake",
    Price: "",
    Quantity: "",
    CakeImage: "",
  });
  const [filePreview, setFilePreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { setLoading } = useLoader();

  const CATEGORY_OPTIONS = ["Cake", "Bread", "Donuts", "Pastry", "Cookies"];

  const getBakerIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["UserId"] || null;
    } catch {
      return null;
    }
  };

  const bakerId = getBakerIdFromToken();

  useEffect(() => {
    let mounted = true;

    const resetForm = () => {
      if (!mounted) return;
      setFormData({
        Name: "",
        Category: "Cake",
        Price: "",
        Quantity: "",
        CakeImage: "",
      });
      setFilePreview(null);
    };

    const fetchCakeById = async (cakeId) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/cakes/${cakeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setFormData({
          Name: res.data.name || "",
          Category: CATEGORY_OPTIONS.includes(res.data.category)
            ? res.data.category
            : "Cake",
          Price: res.data.price?.toString() || "",
          Quantity: res.data.quantity?.toString() || "",
          CakeImage: res.data.cakeImage || "",
        });
        setFilePreview(null);
      } catch (err) {
        console.error("Error fetching cake details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchCakeById(id);
    } else {
      resetForm();
    }

    return () => {
      mounted = false;
    };
  }, [id, isEdit, setLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "Price" || name === "Quantity") && value < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFilePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFilePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.Name?.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.Category) {
      alert("Category is required");
      return;
    }
    if (!formData.Price || parseFloat(formData.Price) <= 0) {
      alert("Price must be a positive number");
      return;
    }
    if (!formData.Quantity || parseFloat(formData.Quantity) <= 0) {
      alert("Quantity must be a positive number");
      return;
    }

    const cakeData = {
      CakeId: isEdit ? parseInt(id, 10) : 0,
      Name: formData.Name,
      Category: formData.Category,
      Price: parseFloat(formData.Price) || 0,
      Quantity: parseFloat(formData.Quantity) || 0,
      CakeImage: filePreview || formData.CakeImage || DEFAULT_IMAGE,
      BakerId: bakerId,
    };

    try {
      setLoading(true);
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/cakes/${id}`, cakeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowUpdateSuccess(true);
      } else {
        await axios.post(`${API_BASE_URL}/cakes`, cakeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error saving cake");
    } finally {
      setLoading(false);
    }
  };

  const closeAndRedirect = () => {
    setShowSuccess(false);
    setShowUpdateSuccess(false);
    navigate("/baker/cakes");
  };

  return (
    <div className="main-container">
      <h3 className="mb-3">{isEdit ? "Update Cake" : "Create New Cake"}</h3>

      <form onSubmit={handleSubmit} className="row g-3" autoComplete="off">
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            className="form-select"
            required
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            name="Name"
            className="form-control"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input
            name="Price"
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            value={formData.Price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Quantity (Kg)</label>
          <input
            name="Quantity"
            type="number"
            min="0"
            step="0.1"
            className="form-control"
            value={formData.Quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Image</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
        </div>

        <div className="col-md-6">
          {(filePreview || formData.CakeImage) && (
            <img
              src={filePreview || formData.CakeImage}
              alt="preview"
              className="cake-image"
              style={{ maxHeight: 200 }}
            />
          )}
        </div>

        <div className="col-12">
          <button className="btn btn-primary me-2" type="submit">
            {isEdit ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/baker/cakes")}
          >
            Cancel
          </button>
        </div>
      </form>

      <Modal
        show={showSuccess}
        title="Success"
        message="Cake added successfully."
        onClose={closeAndRedirect}
      />
      <Modal
        show={showUpdateSuccess}
        title="Updated"
        message="Cake updated successfully."
        onClose={closeAndRedirect}
      />
    </div>
  );
}