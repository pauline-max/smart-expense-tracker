import React, { useState } from 'react';
import './DailyExpenses.css';
import axios from 'axios';
const DailyExpenses = ({ onShowHistory }) => {
  const [rows, setRows] = useState([{ title: '', category: '', amount: '' }]);
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [comment, setComment] = useState('');

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows]; updatedRows[index][field] = value;
    setRows(updatedRows);
  };
  const handleSave = () => setRows([...rows, { title: '', category: '', amount: '' }]);
  const handleSubmit = async (e) => {
    e.preventDefault();

  const validExpenses = rows.filter(
    (row) => row.title || row.category || row.amount
  );

  if (validExpenses.length === 0) {
    alert('Please fill in at least one row before submitting.');
    return;
  }

  try {
    for (const exp of validExpenses) {
      await axios.post('/api/expenses', {
        title: exp.title || 'untitled',
        category: exp.category || 'uncategorized',
        amount: parseFloat(exp.amount) || 0,
        date: date || new Date().toISOString().slice(0, 10),
        budget: parseFloat(budget)||0,
        comment: comment || '',
      });
    }

    alert('Expenses submitted successfully!');
     
    setRows([{ title: '', category: '', amount: '' }]);
    setDate('');
    setBudget('');
    setComment('');
  } catch (error) {
    console.error('Error submitting expenses:', error);
    alert('Failed to submit one or more expenses.');
  }
};

  return (
    <div className="daily-expense-container">
      <div className="tracker-title">
      <h1>EXPENSE-TRACKER</h1>
    </div>
      <div className="header-row">
        <h2 className="section-title">
          MY DAILY EXPENSES
        </h2>
        <button className="link-button" onClick={onShowHistory}>
          My History
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Daily Budget:</label>
          <input
            type="number"
            className="budget-input"
            value={budget}
            onChange={e => setBudget(e.target.value)}
          />
        </div>

        {rows.map((row,i) => (
          <div key={i} className="form-row">
            <label>Title:</label>
            <input
              type="text"
              className="small-input"
              value={row.title}
              onChange={e => handleInputChange(i,'title',e.target.value)}
            />
            <label>Category:</label>
            <input
              type="text"
              className="small-input"
              value={row.category}
              onChange={e =>handleInputChange(i,'category',e.target.value)}
            />
            <label>Amount:</label>
            <input
              type="number"
              className="small-input"
              value={row.amount}
              onChange={e =>handleInputChange(i,'amount',e.target.value)}
            />
            {i === rows.length - 1 && (
              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
              >
                save
              </button>
            )}
          </div>
        ))}

        <div className="form-row comment-row">
          <label>Comment:</label>
          <textarea
            className="comment-box"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Date:</label>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DailyExpenses;
