import React, { useState, useEffect } from 'react';
import './EditExpenseModal.css';

const EditExpenseModal = ({ expense, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: '',
    comment: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        category: expense.category || '',
        amount: expense.amount || '',
        comment: expense.comment || ''
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...expense, ...formData, amount: parseFloat(formData.amount) });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Expense</h3>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
        <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount" />
        <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;
