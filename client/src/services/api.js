import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Expense endpoints
export const expenseAPI = {
  // Add single expense
  addExpense: async (expense) => {
    const response = await api.post("/expenses", expense);
    return response.data;
  },

  // Get all expenses
  getAllExpenses: async () => {
    const response = await api.get("/expenses");
    return response.data;
  },

  // Get latest timestamp
  getLatestTimestamp: async () => {
    const response = await api.get("/expenses/latest");
    return response.data;
  },

  // Insert parsed Excel transactions
  insertBatchTransactions: async (transactions) => {
    const response = await api.post("/expenses/batch", {
      transactions,
    });
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Update expense note
  updateExpenseNote: async (id, notes) => {
    const response = await api.patch(`/expenses/${id}/notes`, { notes });
    return response.data;
  },
};

export default api;
