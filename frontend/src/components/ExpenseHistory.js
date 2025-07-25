import React, { useEffect, useState } from 'react';
import './ExpenseHistory.css';
import axios from 'axios';
import MonthlyBreakdown from './MonthlyBreakdown';

const ExpenseHistory = ({ onBack }) => {
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch expenses 
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(res.data);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  // DELETE expenses
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Failed to delete expense.');
    }
  };

  // Open the edit modal
  const handleEditClick = (expense) => {
    setCurrentExpense({ ...expense });
    setIsEditing(true);
  };

  // Handle form changes inside modal
  const handleInputChange = (field, value) => {
    setCurrentExpense((prev) => ({
      ...prev,
      [field]: field === 'amount' ? Number(value) : value,
    }));
  };

  // Submit the edited expense
  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/expenses/${currentExpense._id}`,
        currentExpense
      );
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === currentExpense._id ? res.data : exp))
      );
      setIsEditing(false);
      setCurrentExpense(null);
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Failed to update expense.');
    }
  };

  // Filter and group expenses by date
  const filteredExpenses = expenses.filter((exp) =>
    [exp.title, exp.category, exp.comment]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const groupedByDate = filteredExpenses.reduce((acc, expense) => {
    const dateKey = new Date(expense.date).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {});

  return (
    <div className="history-container">
      {/* Header */}
      <div className="header-row">
        <h2 className="section-title">MY EXPENSE HISTORY</h2>
        <button className="link-button" onClick={onBack}>
          Back
        </button>
      </div>

      {/* Search Filter */}
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by title, category, or comment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Expense History Grouped by Date */}
      {Object.entries(groupedByDate).map(([date, dailyExpenses]) => {
        const totalSpent = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
        const budget = dailyExpenses.find((e) => typeof e.budget === 'number')?.budget || 0;
        const balance = budget - totalSpent;

        return (
          <div key={date} className="expense-day-group">
            <h3>
              {new Date(date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Comment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dailyExpenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.title}</td>
                    <td>{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.comment}</td>
                    <td>
                      <div className="dropdown">
                        <button className="dots-btn">⋮</button>
                        <div className="dropdown-content">
                          <button onClick={() => handleEditClick(exp)}>Edit</button>
                          <button onClick={() => handleDelete(exp._id)}>Delete</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="total-spent">
              <strong>Total Spent:</strong> {totalSpent.toFixed(2)} <br />
              <strong>Budget:</strong> {budget.toFixed(2)} <br />
              <strong>Balance:</strong> {balance.toFixed(2)}
            </p>
          </div>
        );
      })}

      {/* Edit Modal */}
      {isEditing && currentExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Expense</h3>

            <label>Title:</label>
            <input
              type="text"
              value={currentExpense.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

            <label>Amount:</label>
            <input
              type="number"
              value={currentExpense.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />

            <label>Category:</label>
            <input
              type="text"
              value={currentExpense.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />

            <label>Comment:</label>
            <textarea
              value={currentExpense.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <MonthlyBreakdown />
    </div>
  );
};

export default ExpenseHistory;
