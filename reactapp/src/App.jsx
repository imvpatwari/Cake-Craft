import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import HomePage from "./Components/HomePage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import { LoaderProvider } from "./Components/LoaderContext.jsx";

import BakerNavbar from "./BakerComponents/BakerNavbar.jsx";
import ViewCake from "./BakerComponents/ViewCake.jsx";
import CakeForm from "./BakerComponents/CakeForm.jsx";

import CustomerNavbar from "./CustomerComponents/CustomerNavbar.jsx";
import CustomerViewCake from "./CustomerComponents/CustomerViewCake.jsx";
import WishlistPage from "./CustomerComponents/WishlistPage.jsx";

function HomeLayout() {
  const role = localStorage.getItem("role");
  return (
    <>
      {role === "Baker" && <BakerNavbar />}
      {role === "Customer" && <CustomerNavbar />}
      <HomePage />
    </>
  );
}

function BakerLayout() {
  return (
    <>
      <BakerNavbar />
      <Outlet />
    </>
  );
}

function CustomerLayout() {
  return (
    <>
      <CustomerNavbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <LoaderProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Common home */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomeLayout />
              </PrivateRoute>
            }
          />

          {/* Baker */}
          <Route
            path="/baker"
            element={
              <PrivateRoute role="Baker">
                <BakerLayout />
              </PrivateRoute>
            }
          >
            <Route path="cakes" element={<ViewCake />} />
            <Route path="add-cake" element={<CakeForm />} />
            <Route path="edit-cake/:id" element={<CakeForm />} />
          </Route>

          {/* Customer */}
          <Route
            path="/customer"
            element={
              <PrivateRoute role="Customer">
                <CustomerLayout />
              </PrivateRoute>
            }
          >
            <Route path="cakes" element={<CustomerViewCake />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </LoaderProvider>
  );
}