import React, { useState } from 'react';
import DailyExpenses from './components/DailyExpenses';
import ExpenseHistory from './components/ExpenseHistory';
import './App.css';


function App() {
  
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="app-container">
      {showHistory ? (
        <ExpenseHistory onBack={() => setShowHistory(false)} />
      ) : (
        <DailyExpenses onShowHistory={() => setShowHistory(true)} />
      )}
    </div>
  );
}

export default App;
