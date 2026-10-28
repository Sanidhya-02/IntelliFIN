import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <div className="dashboard-header">
        <h1>Welcome to Expense Handler</h1>
        <p className="lead">
          Manage your Paytm expenses and UPI transactions effortlessly
        </p>
      </div>

      <div className="row mt-5">
        {/* Add Expense Card - Clickable */}
        <div className="col-md-6 mb-4">
          <Link to="/add" className="card-link">
            <div className="card feature-card">
              <div className="card-body text-center">
                <div className="card-icon">➕</div>
                <h5 className="card-title">Add Expense</h5>
                <p className="card-text">
                  Manually add a new expense transaction with details like
                  amount, category, and notes.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Upload Excel Card - Clickable */}
        <div className="col-md-6 mb-4">
          <Link to="/upload" className="card-link">
            <div className="card feature-card">
              <div className="card-body text-center">
                <div className="card-icon">📂</div>
                <h5 className="card-title">Upload Excel</h5>
                <p className="card-text">
                  Upload your Paytm UPI statement in Excel format. Smart
                  deduplication ensures no duplicates.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* View Expenses Card - Clickable */}
        <div className="col-md-6 mb-4">
          <Link to="/view" className="card-link">
            <div className="card feature-card">
              <div className="card-body text-center">
                <div className="card-icon">📊</div>
                <h5 className="card-title">View Expenses</h5>
                <p className="card-text">
                  See all your transactions in a comprehensive table format with
                  edit and delete options.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* View by Category Card - Clickable */}
        <div className="col-md-6 mb-4">
          <Link to="/category" className="card-link">
            <div className="card feature-card">
              <div className="card-body text-center">
                <div className="card-icon">📑</div>
                <h5 className="card-title">View by Category</h5>
                <p className="card-text">
                  Filter expenses by date range and view them grouped by
                  category with totals.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <div className="info-box">
            <h5>📌 How to use:</h5>
            <ul>
              <li>
                Use the <strong>Add Expense</strong> section to manually record
                transactions
              </li>
              <li>
                Download your Paytm statement and <strong>Upload Excel</strong>{" "}
                for bulk import
              </li>
              <li>
                Review all transactions in <strong>View Expenses</strong>
              </li>
              <li>
                Analyze spending patterns with <strong>View by Category</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
