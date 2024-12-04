#FinanceTracker
POST http://localhost:3000/expenses
{
    "category": "Travel",
    "amount": 500,
    "date": "2024-12-04"
}
{
    "status": "success",
    "data": {
        "id": 1,
        "category": "Travel",
        "amount": 500,
        "date": "2024-12-04"
    }
}
GET http://localhost:3000/expenses
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "category": "Travel",
            "amount": 500,
            "date": "2024-12-04"
        }
    ]
}
GET http://localhost:3000/expenses/analysis
{
    "status": "success",
    "data": {
        "Travel": 500
    }
}
