const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  // Date/Time fields (stored as ISO string for consistency)
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Display fields (stored as-is from input)
  date: {
    type: String, // YYYY-MM-DD from HTML input
    required: true,
  },
  time: {
    type: String, // HH:MM:SS
    required: false,
  },
  // Transaction details
  description: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "Misc",
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String, // "Credit" or "Debit"
    required: true,
  },
  // Source tracking
  source: {
    type: String, // "Manual" or "Excel"
    default: "Manual",
  },
  // Additional fields from Excel
  tags: String,
  refNo: String,
  account: String,
  // Notes
  notes: {
    type: String,
    default: null,
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
expenseSchema.index({ timestamp: -1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
