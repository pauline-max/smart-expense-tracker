import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const MonthlyBreakdown = () => {
  const [monthlyData, setMonthlyData] = useState({ labels: [], spent: [], budget: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/expenses');

        const grouped = {};

        res.data.forEach((exp) => {
          const date = new Date(exp.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          if (!grouped[monthKey]) {
            grouped[monthKey] = { spent: 0, budget: 0 };
          }

          grouped[monthKey].spent += exp.amount;

          // Only assign budget once per day — avoids duplicates
          if (exp.budget && grouped[monthKey].budget === 0) {
            grouped[monthKey].budget = exp.budget;
          }
        });

        const labels = Object.keys(grouped).sort();
        const spent = labels.map((month) => grouped[month].spent);
        const budget = labels.map((month) => grouped[month].budget);

        setMonthlyData({ labels, spent, budget });
      } catch (error) {
        console.error("Failed to fetch monthly data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Spent',
        data: monthlyData.spent,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Budget',
        data: monthlyData.budget,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ width: '90%', margin: 'auto', padding: '20px' }}>
      <h2>Monthly Budget vs Spent</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyBreakdown;
