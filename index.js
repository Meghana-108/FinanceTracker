const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron'); // Import node-cron for scheduling tasks

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Parse incoming JSON requests

let expenses = []; // Storage for expenses

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Personal Expense Tracker API!' });
});

app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;

    // Validation
    const validCategories = ['Food', 'Travel', 'Shopping', 'Others'];
    if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ status: 'error', error: 'Invalid category' });
    }
    if (amount <= 0) {
        return res.status(400).json({ status: 'error', error: 'Amount must be positive' });
    }
    if (!date) {
        return res.status(400).json({ status: 'error', error: 'Date is required' });
    }

    // Add expense
    const newExpense = { id: expenses.length + 1, category, amount, date };
    expenses.push(newExpense);

    res.status(201).json({ status: 'success', data: newExpense });
});

app.get('/expenses', (req, res) => {
    const { category, startDate, endDate } = req.query;

    let filteredExpenses = expenses;

    // Filter by category
    if (category) {
        filteredExpenses = filteredExpenses.filter(exp => exp.category === category);
    }

    // Filter by date range
    if (startDate && endDate) {
        filteredExpenses = filteredExpenses.filter(exp => {
            return exp.date >= startDate && exp.date <= endDate;
        });
    }

    res.json({ status: 'success', data: filteredExpenses });
});

app.get('/expenses/analysis', (req, res) => {
    const analysis = {}; // Object to store category-wise spending

    // Loop through each expense and aggregate the amount by category
    expenses.forEach(exp => {
        if (!analysis[exp.category]) {
            analysis[exp.category] = 0; // Initialize the category if it doesn't exist
        }
        analysis[exp.category] += exp.amount; // Add the amount to the category total
    });

    res.json({ status: 'success', data: analysis }); // Send the result
});

// CRON job to generate weekly summary every 30 seconds for testing
cron.schedule('*/30 * * * * *', () => {
    console.log('Generating quick expense summary...');

    const weeklyReport = {
        totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        byCategory: expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {})
    };

    console.log('Quick 30s Report:', weeklyReport);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
