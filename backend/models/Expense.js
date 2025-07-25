const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive'],
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
  budget: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive'],
  }
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;

