import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          💰 Expense Handler
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add">
                ➕ Add Expense
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">
                📂 Upload Excel
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/view">
                📊 View Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category">
                📑 View by Category
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
