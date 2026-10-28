const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  getLatestTimestamp,
  insertParsedTxns,
  deleteExpense,
  updateExpenseNote,
} = require("../controllers/expenseController");

// Manual expense operations
router.post("/", addExpense);
router.get("/", getAllExpenses);
router.get("/latest", getLatestTimestamp);

// Excel upload operations
router.post("/batch", insertParsedTxns);

// Single expense operations
router.delete("/:id", deleteExpense);
router.patch("/:id/notes", updateExpenseNote);

module.exports = router;
