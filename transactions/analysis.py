import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from .models import Transaction
from django.db.models import Sum
from django.db.models.functions import TruncMonth

def predict_next_month_spending(user):
    """
    Uses Linear Regression to predict next month's total expenses.
    Demonstrates: Data Science integration with Django.
    """
    # 1. Fetch historical data from SQL using Django ORM
    # We group expenses by month
    data = (
        Transaction.objects.filter(user=user, transaction_type='EXPENSE')
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )

    if len(data) < 2:
        return "Need at least 2 months of data to predict."

    # 2. Convert to DataFrame for analysis
    df = pd.DataFrame(list(data))
    
    # We use month index (0, 1, 2...) as X and total spending as Y
    df['month_index'] = np.arange(len(df)).reshape(-1, 1)
    X = df[['month_index']]
    y = df['total'].astype(float)

    # 3. Train the Model (Simple Linear Regression)
    model = LinearRegression()
    model.fit(X, y)

    # 4. Predict for the next month index
    next_month_index = np.array([[len(df)]])
    prediction = model.predict(next_month_index)[0]

    return round(float(prediction), 2)