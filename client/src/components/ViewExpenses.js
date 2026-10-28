import React, { useState, useEffect } from "react";
import { expenseAPI } from "../services/api";
import { formatCurrency, isoToHHMMSS } from "../services/dateUtils";
import LoadingSpinner from "./LoadingSpinner";
import "./ViewExpenses.css";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState("");

  const loadExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await expenseAPI.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      setError(`❌ Error loading expenses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDeleteClick = async (id) => {
    if (window.confirm("❌ Are you sure you want to delete this expense?")) {
      try {
        await expenseAPI.deleteExpense(id);
        setExpenses(expenses.filter((e) => e._id !== id));
      } catch (err) {
        setError(`❌ Error deleting expense: ${err.message}`);
      }
    }
  };

  const handleEditNoteClick = (id, currentNote) => {
    setEditingId(id);
    setEditingNote(currentNote || "");
  };

  const handleSaveNote = async (id) => {
    try {
      await expenseAPI.updateExpenseNote(id, editingNote);
      setExpenses(
        expenses.map((e) => (e._id === id ? { ...e, notes: editingNote } : e)),
      );
      setEditingId(null);
      setEditingNote("");
    } catch (err) {
      setError(`❌ Error updating note: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNote("");
  };

  if (loading) return <LoadingSpinner />;

  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h3>📊 All Expenses</h3>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={loadExpenses}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card summary-card">
            <div className="card-body">
              <h5 className="card-title">Summary</h5>
              <div className="row text-center">
                <div className="col-md-6">
                  <p className="summary-label">Total Transactions</p>
                  <p className="summary-value">{expenses.length}</p>
                </div>
                <div className="col-md-6">
                  <p className="summary-label">Total Amount</p>
                  <p className="summary-value">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {expenses.length === 0 ? (
            <div className="alert alert-info">
              No expenses found. Start by <strong>Adding an Expense</strong> or{" "}
              <strong>Uploading an Excel file</strong>.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th style={{ width: "100px" }}>Date</th>
                    <th style={{ width: "80px" }}>Time</th>
                    <th>Description</th>
                    <th style={{ width: "100px" }}>Category</th>
                    <th style={{ width: "100px" }} className="text-end">
                      Amount
                    </th>
                    <th style={{ width: "70px" }}>Type</th>
                    <th style={{ width: "150px" }}>Notes</th>
                    <th style={{ width: "100px" }} className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.date}</td>
                      <td>{isoToHHMMSS(expense.timestamp)}</td>
                      <td className="description-cell">
                        {expense.description}
                      </td>
                      <td>{expense.category}</td>
                      <td className="text-end amount-cell">
                        <strong>{formatCurrency(expense.amount)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            expense.type === "Credit"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {expense.type}
                        </span>
                      </td>
                      <td>
                        {editingId === expense._id ? (
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              value={editingNote}
                              onChange={(e) => setEditingNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="note-text">
                            {expense.notes ? (
                              <>📝 {expense.notes}</>
                            ) : (
                              <em style={{ color: "#999" }}>No note</em>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        {editingId === expense._id ? (
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => handleSaveNote(expense._id)}
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() =>
                                handleEditNoteClick(expense._id, expense.notes)
                              }
                              title="Edit note"
                            >
                              📝
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteClick(expense._id)}
                              title="Delete"
                            >
                              ❌
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;
