# 🏦 FinTrack AI: Predictive Financial Dashboard
FinTrack AI is a sophisticated personal finance application that bridges the gap between traditional expense tracking and Machine Learning-driven proactive planning. By analyzing historical spending patterns using Linear Regression, the app provides users with an estimated budget for the upcoming month.

---

### Key Features

 - AI Budget Forecasting: Implements a Scikit-Learn Linear Regression model to predict future spending based on time-series historical data.
 -  Real-time SQL Sync: Seamlessly fetches and updates transaction records from a Django-managed SQLite database.
 -  Premium UI/UX: A high-contrast, dark-mode dashboard built with React and Tailwind CSS, optimized for data visualization.
 -  Secure Audit Log: A detailed transaction history view with dynamic category labels and automatic currency formatting.
   


### The Machine Learning Engine
The core of FinTrack AI is its predictive analytics module.
- Algorithm: Ordinary Least Squares (OLS) Linear Regression.
- Process: The system extracts EXPENSE type transactions, converts dates into ordinal values, and trains a model to identify the slope of spending.
- Fallback Logic: Includes smart-averaging fallbacks to handle small datasets or non-linear growth, ensuring the UI always displays meaningful insights.

### Tech Stack
Frontend
- Framework: React (Vite)
- Styling: Tailwind CSS (Modern Design Tokens)
-  Icons: Lucide-React
-   HTTP Client: Axios
  
Backend
- Framework: Django & Django REST Framework (DRF)
- Database: SQLite (Relational)
- Scientific Computing: Pandas, NumPy, Scikit-Learn

### Installation & Setup

1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/fintrack-ai.git](https://github.com/YOUR_USERNAME/fintrack-ai.git)
cd fintrack-ai
```

3. Backend Setup
```bash
cd fintrack_backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create your admin login
python manage.py runserver
```

4. Frontend Setup
```bash
cd fintrack_frontend
npm install
npm run dev
```

### Project Structure
```
├── fintrack_backend/
│   ├── transactions/      # API Views, Models, and ML Logic
│   ├── core/              # Project settings & CORS config
│   └── manage.py
├── fintrack_frontend/
│   ├── src/
│   │   ├── App.jsx       # Main Dashboard UI & API Integration
│   └── tailwind.config.js
└── README.md
```
### Contribution & License
This project was built as a demonstration of bridging Data Science with Web Development. Feel free to fork, open issues, or submit pull requests!
License: MIT
