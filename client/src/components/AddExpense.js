import React, { useState } from "react";
import { expenseAPI } from "../services/api";
import { extractCategory } from "../services/dateUtils";
import LoadingSpinner from "./LoadingSpinner";
import "./AddExpense.css";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
    upiId: "",
    category: "",
    amount: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.date ||
        !formData.time ||
        !formData.description ||
        !formData.category ||
        !formData.amount
      ) {
        throw new Error("Please fill all required fields");
      }

      const expenseData = {
        date: formData.date, // YYYY-MM-DD from HTML input
        time: formData.time,
        description: formData.description,
        upiId: formData.upiId || "",
        category: extractCategory(formData.category),
        amount: parseFloat(formData.amount),
        notes: formData.notes || null,
      };

      await expenseAPI.addExpense(expenseData);
      setSuccess("✅ Expense added successfully!");

      // Reset form
      setFormData({
        date: "",
        time: "",
        description: "",
        upiId: "",
        category: "",
        amount: "",
        notes: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">➕ Manually Add Expense</h3>

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label">
                      Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="time" className="form-label">
                      Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="form-control"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="e.g. Paid to Ashok S Shetty"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="upiId" className="form-label">
                    UPI ID / Account Number
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    className="form-control"
                    placeholder="e.g. ashok86601374@barodampay"
                    value={formData.upiId}
                    onChange={handleChange}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="amount" className="form-label">
                      Amount <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      className="form-control"
                      placeholder="140.00"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">--Select Category--</option>
                      <option value="#🍔 Food">#🍔 Food</option>
                      <option value="#🛒 Groceries">#🛒 Groceries</option>
                      <option value="#💸 Transfers">#💸 Transfers</option>
                      <option value="#🛍️ Shopping">#🛍️ Shopping</option>
                      <option value="#🚕 Taxi">#🚕 Taxi</option>
                      <option value="#✈️ Travel">#✈️ Travel</option>
                      <option value="#💊 Medical">#💊 Medical</option>
                      <option value="#🧾 BillPayments">
                        #🧾 Bill Payments
                      </option>
                      <option value="#🧩 Miscellaneous">
                        #🧩 Miscellaneous
                      </option>
                      <option value="#📦 Others">#📦 Others</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <input
                    type="text"
                    id="notes"
                    name="notes"
                    className="form-control"
                    placeholder="Optional note (e.g. Had burger)"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Add Expense
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
