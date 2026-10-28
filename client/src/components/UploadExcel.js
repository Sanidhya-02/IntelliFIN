import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { expenseAPI } from "../services/api";
import {
  excelDateToISO,
  formatCurrency,
  extractCategory,
} from "../services/dateUtils";
import LoadingSpinner from "./LoadingSpinner";
import "./UploadExcel.css";

const UploadExcel = () => {
  const [parsedTxns, setParsedTxns] = useState([]);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);

  // Fetch latest timestamp on mount
  useEffect(() => {
    const fetchLatestTimestamp = async () => {
      try {
        const data = await expenseAPI.getLatestTimestamp();
        setLatestTimestamp(data.timestamp ? new Date(data.timestamp) : null);
      } catch (err) {
        console.error("Error fetching latest timestamp:", err);
      }
    };
    fetchLatestTimestamp();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Find sheet with "Passbook" in name (case-insensitive)
      const sheetName = workbook.SheetNames.find((name) =>
        name.toLowerCase().includes("passbook"),
      );

      if (!sheetName) {
        throw new Error('Could not find "Passbook" sheet in Excel file');
      }

      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Filter and map rows
      const transactions = rows
        .filter(
          (r) =>
            r["Date"] && r["Time"] && r["Transaction Details"] && r["Amount"],
        )
        .map((r) => {
          const date = r["Date"]; // DD/MM/YYYY format from Excel
          const time = r["Time"]; // HH:MM:SS format
          const timestamp = excelDateToISO(date, time);

          // Determine if new or old
          const isNew =
            !latestTimestamp || new Date(timestamp) > latestTimestamp;

          // Extract amount and determine type
          const amountVal =
            parseFloat((r["Amount"] || "0").replace(/[^\d.-]/g, "")) || 0;
          const type = (r["Amount"] || "").includes("+") ? "Credit" : "Debit";

          return {
            timestamp,
            date,
            time,
            description: r["Transaction Details"],
            upiId: r["Other Transaction Details (UPI ID or A/c No)"] || "",
            amount: amountVal,
            type,
            category: extractCategory(r["Tags"] || ""),
            source: "Excel",
            tags: r["Tags"] || "",
            refNo: r["UPI Ref No."] || "",
            account: r["Your Account"] || "",
            isNew,
          };
        });

      setParsedTxns(transactions);
      // Pre-select only new transactions
      setSelectedCount(transactions.filter((t) => t.isNew).length);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    const updated = [...parsedTxns];
    updated[index].selected = !updated[index].selected;
    setParsedTxns(updated);
    setSelectedCount(updated.filter((t) => t.selected).length);
  };

  const toggleAllNew = () => {
    const updated = parsedTxns.map((t) => ({
      ...t,
      selected: t.isNew ? !t.isNew : t.selected,
    }));
    setParsedTxns(updated);
    setSelectedCount(updated.filter((t) => t.selected).length);
  };

  const toggleAllOld = () => {
    const updated = parsedTxns.map((t) => ({
      ...t,
      selected: !t.isNew ? !!t.isNew : t.selected,
    }));
    setParsedTxns(updated);
    setSelectedCount(updated.filter((t) => t.selected).length);
  };

  const handleUpload = async () => {
    const selected = parsedTxns.filter((t) => t.selected);

    if (selected.length === 0) {
      setError("❌ No transactions selected");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await expenseAPI.insertBatchTransactions(selected);
      setSuccess(
        `✅ ${result.insertedCount} transactions uploaded successfully!`,
      );
      setParsedTxns([]);
      setSelectedCount(0);
    } catch (err) {
      setError(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && parsedTxns.length === 0) return <LoadingSpinner />;

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">📂 Upload Paytm Statement</h3>

              <div className="mb-3">
                <label htmlFor="excelFile" className="form-label">
                  Select Excel File (.xlsx)
                </label>
                <input
                  type="file"
                  id="excelFile"
                  className="form-control"
                  accept=".xlsx"
                  onChange={handleFileSelect}
                />
                <small className="text-muted">
                  Expected format: Paytm UPI Passbook with columns: Date, Time,
                  Transaction Details, Amount, Tags
                </small>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </div>
          </div>
        </div>
      </div>

      {parsedTxns.length > 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  Preview ({selectedCount} of {parsedTxns.length} selected)
                </h5>

                <div className="preview-controls mb-3">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={toggleAllNew}
                  >
                    🟢 Toggle All New (
                    {parsedTxns.filter((t) => t.isNew).length})
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={toggleAllOld}
                  >
                    🔴 Toggle All Old (
                    {parsedTxns.filter((t) => !t.isNew).length})
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "50px" }}>
                          <input
                            type="checkbox"
                            checked={selectedCount === parsedTxns.length}
                            onChange={(e) => {
                              const updated = parsedTxns.map((t) => ({
                                ...t,
                                selected: e.target.checked,
                              }));
                              setParsedTxns(updated);
                              setSelectedCount(
                                updated.filter((t) => t.selected).length,
                              );
                            }}
                          />
                        </th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedTxns.map((txn, index) => (
                        <tr
                          key={index}
                          className={txn.isNew ? "row-new" : "row-old"}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={txn.selected || false}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td>{txn.date}</td>
                          <td>{txn.time}</td>
                          <td className="description-cell">
                            {txn.description}
                          </td>
                          <td>{txn.category}</td>
                          <td>{formatCurrency(txn.amount)}</td>
                          <td>{txn.type}</td>
                          <td>
                            <span
                              className={`badge ${txn.isNew ? "bg-success" : "bg-danger"}`}
                            >
                              {txn.isNew ? "New" : "Old"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={selectedCount === 0 || loading}
                  >
                    {loading
                      ? "Uploading..."
                      : `Upload ${selectedCount} Transactions`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
