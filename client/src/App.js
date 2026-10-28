import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import UploadExcel from "./components/UploadExcel";
import ViewExpenses from "./components/ViewExpenses";
import ViewCategory from "./components/ViewCategory";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/upload" element={<UploadExcel />} />
        <Route path="/view" element={<ViewExpenses />} />
        <Route path="/category" element={<ViewCategory />} />
      </Routes>
      <footer className="app-footer">
        <p>&copy; 2025 Expense Handler. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
