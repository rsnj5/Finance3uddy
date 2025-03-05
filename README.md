# Finance3uddy

## Personal Finance Management Platform

### Objective
Finance3uddy is a web-based Personal Finance Management Platform designed to help users efficiently track, analyze, and manage their income, expenses, and transactions. The platform provides tools for budgeting, financial insights, and transaction organization to assist users in making informed financial decisions.

## Features

### 1. Income and Expense Tracking
- Users can add, edit, and categorize income and expenses (e.g., rent, groceries, entertainment).

### 2. Graphs and Visualizations
- Interactive charts display financial trends, monthly summaries, and expense breakdowns.

### 3. CSV Import/Export
- Users can import bank statements via CSV files and export data for offline use or tax purposes.

### 4. Transaction Management
- Search, filter, and sort transactions by date, category, or amount for better financial organization.

### 5. User-Friendly Dashboard
- Intuitive UI displaying key metrics such as total income, expenses, and savings.

### 6. Data Security & Authentication
- Secure user authentication and financial data storage.

### 7. Notifications & Bill Reminders
- Alerts for upcoming payments and bills.

### 8. Financial Goal Setting
- Users can set savings goals and track their progress.

### Optional Features
- **Bank Account Linking** – Integrate with APIs for real-time transaction syncing.
- **Smart Budgeting** – Suggestions based on spending patterns.
- **Expense Splitting** – Allow users to split expenses with friends, track shared costs, and settle balances easily.
- **Custom Reports** – Generate personalized reports for financial planning or tax purposes.

---

## Tech Stack
- **Backend:** Django (Python)
- **Frontend:** React (JavaScript)
- **Database:** PostgreSQL 
- **Authentication:** Django Authentication
- **Data Visualization:** Chart.js 

---

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Python (>=3.8)
- Node.js (>=16)
- PostgreSQL (if using a production database)

### Backend Setup (Django)
```bash
# Clone the repository
git clone https://github.com/yourusername/finance3uddy.git
cd finance3uddy/backend

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Run the server
python manage.py runserver
```

### Frontend Setup (React)
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the Project
- The backend will be available at `http://127.0.0.1:8000/`
- The frontend will run at `http://localhost:3000/`

---

## Environment Variables
Create a `.env` file in the `backend/` directory and configure the following variables:
```
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_database_url
```
Similarly, for the frontend, create a `.env` file in `frontend/`:
```
REACT_APP_API_URL=http://127.0.0.1:8000/
```

---

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Register a new user |
| `/api/auth/login/` | POST | Login a user |
| `/api/transactions/` | GET | Get all transactions |
| `/api/transactions/` | POST | Add a new transaction |
| `/api/goals/` | GET | Get all financial goals |

---

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-branch`
5. Open a pull request

---

## License
This project is licensed under the MIT License.
