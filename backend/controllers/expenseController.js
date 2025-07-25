const Expense = require('../models/Expense');

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find(); // check if Expense is defined
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ error: "Server error while fetching expenses" });
  }
};


// Add new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, budget, comment } = req.body;
    const newExpense = new Expense({ title, amount, category, date, budget, comment });
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully!', expense: newExpense });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body, {new:true });
    res.status(200).json({ message: 'Expense updated', updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    console.log("trying to delete expense with ID:", req.params.id);

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
