import React, { useState } from "react";
import { expenseAPI } from "../services/api";
import { formatCurrency, isoToHHMMSS } from "../services/dateUtils";
import LoadingSpinner from "./LoadingSpinner";
import "./ViewCategory.css";

const ViewCategory = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleView = async (e) => {
    e.preventDefault();
    setError("");
    setGrouped(null);
    setLoading(true);

    try {
      if (!fromDate || !toDate) {
        throw new Error("Please select both from and to dates");
      }

      // Parse dates
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      // Fetch all expenses
      const allExpenses = await expenseAPI.getAllExpenses();

      // Filter by date range
      const filtered = allExpenses.filter((tx) => {
        const txDate = tx.timestamp
          ? new Date(tx.timestamp)
          : new Date(tx.date + "T00:00:00");
        const txDateStr = txDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const fromStr = from.toISOString().split("T")[0];
        const toStr = to.toISOString().split("T")[0];
        return txDateStr >= fromStr && txDateStr <= toStr;
      });

      // Group by category
      const groupedData = {};
      filtered.forEach((tx) => {
        const cat = tx.category || "Uncategorized";
        if (!groupedData[cat]) {
          groupedData[cat] = [];
        }
        groupedData[cat].push(tx);
      });

      // Sort transactions within each category by timestamp desc
      Object.keys(groupedData).forEach((cat) => {
        groupedData[cat].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
      });

      // Expand all categories by default
      const expandedState = {};
      Object.keys(groupedData).forEach((cat) => {
        expandedState[cat] = true;
      });
      setExpandedCategories(expandedState);

      setGrouped(groupedData);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">📑 View Expenses by Category</h3>

              <form onSubmit={handleView}>
                <div className="row">
                  <div className="col-md-5">
                    <label htmlFor="fromDate" className="form-label">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      className="form-control"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-5">
                    <label htmlFor="toDate" className="form-label">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      className="form-control"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100">
                      View
                    </button>
                  </div>
                </div>
              </form>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      {grouped && Object.keys(grouped).length > 0 ? (
        <div className="row">
          <div className="col-12">
            {Object.entries(grouped).map(([category, transactions]) => {
              const categoryTotal = transactions.reduce(
                (sum, t) => sum + (t.amount || 0),
                0,
              );
              const isExpanded = expandedCategories[category];

              return (
                <div key={category} className="category-card mb-3">
                  <div
                    className="category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="category-header-content">
                      <span className="category-toggle">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <h5 className="category-title">
                        {category}
                        <span className="category-count">
                          ({transactions.length})
                        </span>
                      </h5>
                    </div>
                    <div className="category-total">
                      {formatCurrency(categoryTotal)}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="category-body">
                      {transactions.map((txn) => (
                        <div key={txn._id} className="transaction-item">
                          <div className="transaction-main">
                            <div className="transaction-date-time">
                              <span className="date">{txn.date}</span>
                              <span className="time">
                                {isoToHHMMSS(txn.timestamp)}
                              </span>
                            </div>
                            <div className="transaction-description">
                              {txn.description}
                            </div>
                            <div className="transaction-amount">
                              <span
                                className={`amount ${
                                  txn.type === "Credit"
                                    ? "amount-credit"
                                    : "amount-debit"
                                }`}
                              >
                                {txn.type === "Credit" ? "+" : "-"}
                                {formatCurrency(Math.abs(txn.amount))}
                              </span>
                              <span className="source">({txn.source})</span>
                            </div>
                          </div>
                          {txn.notes && (
                            <div className="transaction-notes">
                              📝 {txn.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : grouped === null ? (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="alert alert-info">
              Select a date range and click "View" to see expenses grouped by
              category.
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="alert alert-info">
              No transactions found in the selected date range.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategory;
