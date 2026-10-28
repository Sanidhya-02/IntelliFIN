const Expense = require("../models/Expense");
const { htmlDateAndTimeToISO, excelDateToISO } = require("../utils/dateUtils");

/**
 * Add a single manual expense
 */
exports.addExpense = async (req, res) => {
  try {
    const { date, time, description, upiId, category, amount, notes } =
      req.body;

    // Convert date/time to ISO
    const timestamp = htmlDateAndTimeToISO(date, time);
    if (!timestamp) {
      return res.status(400).json({ error: "Invalid date/time format" });
    }

    const expense = new Expense({
      timestamp,
      date, // Store original YYYY-MM-DD
      time: time || "00:00:00",
      description,
      upiId: upiId || "",
      category: category || "Misc",
      amount: parseFloat(amount),
      type: parseFloat(amount) >= 0 ? "Credit" : "Debit",
      source: "Manual",
      notes: notes || null,
    });

    const saved = await expense.save();
    res.status(201).json({
      id: saved._id,
      message: "Expense added successfully",
      expense: saved,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all expenses ordered by timestamp (newest first)
 */
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ timestamp: -1 }).lean();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get the latest transaction timestamp
 */
exports.getLatestTimestamp = async (req, res) => {
  try {
    const latest = await Expense.findOne()
      .sort({ timestamp: -1 })
      .select("timestamp")
      .lean();

    if (!latest) {
      return res.json({ timestamp: null });
    }

    res.json({ timestamp: latest.timestamp.toISOString() });
  } catch (error) {
    console.error("Error fetching latest timestamp:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Insert parsed transactions from Excel (only new ones)
 */
exports.insertParsedTxns = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: "No transactions provided" });
    }

    // Get latest timestamp
    const latest = await Expense.findOne()
      .sort({ timestamp: -1 })
      .select("timestamp")
      .lean();

    const latestTimestamp = latest ? new Date(latest.timestamp) : null;

    // Filter and prepare transactions
    const toInsert = [];
    for (const txn of transactions) {
      // Convert Excel date format to ISO
      const timestamp = excelDateToISO(txn.date, txn.time);
      if (!timestamp) continue;

      const txnDate = new Date(timestamp);

      // Only insert if newer than latest
      if (!latestTimestamp || txnDate > latestTimestamp) {
        toInsert.push({
          timestamp: txnDate,
          date: txn.date,
          time: txn.time,
          description: txn.description,
          upiId: txn.upiId || "",
          category: txn.category || "Misc",
          amount: parseFloat(txn.amount),
          type: txn.type || "Debit",
          source: "Excel",
          tags: txn.tags || "",
          refNo: txn.refNo || "",
          account: txn.account || "",
          notes: null,
        });
      }
    }

    if (toInsert.length === 0) {
      return res.json({
        insertedCount: 0,
        message: "No new transactions to insert",
        insertedIds: [],
      });
    }

    // Bulk insert
    const result = await Expense.insertMany(toInsert);

    res.json({
      insertedCount: result.length,
      insertedIds: result.map((r) => r._id),
      message: `Inserted ${result.length} new transactions`,
    });
  } catch (error) {
    console.error("Error inserting transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an expense by ID
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Expense.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update expense notes
 */
exports.updateExpenseNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      id,
      { notes, updatedAt: new Date() },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({
      message: "Note updated successfully",
      expense: updated,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: error.message });
  }
};
