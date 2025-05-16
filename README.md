# 💰 FinScope – Personal Budget Tracker

FinScope is a full-stack personal budgeting application that allows users to track their income, expenses, and monthly budgets with beautiful, responsive data visualizations using D3.js in a modern layout.

Credentials are provided below to test the application. As of now I have set only one user, but planning to do user authentication and authorization in future.

---

## 🔗 Live Demo
![Screenshot from 2025-05-16 11-32-43](https://github.com/user-attachments/assets/11f9893c-322b-4de8-9e1b-e1d95079b967)

- **Frontend:** [https://finscope-orpin.vercel.app](https://finscope-orpin.vercel.app)
- **Backend (API):** [https://budjet-tracker.onrender.com](https://budjet-tracker.onrender.com)
- **Test Credentials:**  
  `username: testuser`  
  `password: password`

---

## 📌 Features

### Authentication

- Secure JWT login with Django REST Framework
- Frontend token management via `localStorage`

### Dashboard

- Modular, responsive layout using CSS flex-box
- Clean card-based design for readability and UX

### Charts with D3.js

- **Pie Chart:** Visualizes income, expenses, and balance with value + percentage
- **Bar Chart:** Compares monthly budget vs actual expenses

### Transactions

- Add, edit, and delete income/expense entries
- Filter by date, category, and amount
- Paginated transaction table

### Budget Management

- Set a monthly budget
- Automatically compared with spending

---

## Tech Stack

| Layer      | Tech                                      |
| ---------- | ----------------------------------------- |
| Frontend   | React.js, D3.js, CSS (custom)             |
| Backend    | Django, Django REST Framework             |
| Auth       | JWT (via `djangorestframework-simplejwt`) |
| Deployment | Vercel (Frontend), Render (Backend)       |

---

## Folder Structure

frontend/ → React frontend
├── components/ → Reusable UI and chart components
├── pages/ → Login & Dashboard pages
├── context/ → Auth context
├── services/ → API layer
└── App.jsx → Routes and layout

backend/ → Django backend
├── api/ → Budget + transaction models, views
├── urls.py → API routes
└── settings.py → CORS, JWT, DB config

---

## Environment Setup

### Backend (Django)

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

# setup env variables
DATABASE_URL=<your_postgres_url>


python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```
cd frontend
npm install
npm run dev
```

### Sample Data

Try adding these:

Income: Salary ₹50,000
Expense: Groceries ₹4,500
Set Budget: ₹30,000 for current month
