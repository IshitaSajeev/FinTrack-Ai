from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# ================================
# TRANSACTION VIEWS
# ================================

class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Always return all for testing/demo purposes
        return Transaction.objects.all().order_by('-date')

    def perform_create(self, serializer):
        # Assign to first available user or keep as is
        serializer.save()


class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]
    queryset = Transaction.objects.all()


# ================================
# CATEGORY VIEW (Renamed to CategoryList to match your URL imports)
# ================================

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# ================================
# AI BUDGET FORECAST VIEW
# ================================

class BudgetForecastView(generics.GenericAPIView):
    """
    Predict next month's expense using Linear Regression.
    Fixed to avoid 'M' frequency error and handle small datasets.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # 1. Fetch only EXPENSE transactions
        transactions = Transaction.objects.filter(
            transaction_type__iexact='EXPENSE'
        ).values('amount', 'date')

        if not transactions.exists():
            return Response({
                "predicted_spending_next_month": 0,
                "message": "No expense data found.",
                "data_points_used": 0
            })

        # 2. Convert to DataFrame
        df = pd.DataFrame(list(transactions))
        df['amount'] = df['amount'].astype(float)
        df['date'] = pd.to_datetime(df['date'])
        
        # Sort by date for proper time series
        df = df.sort_values('date')

        # 3. Use Day-based Regression (Avoids the 'M' vs 'ME' frequency error)
        # Convert dates to ordinal numbers (days since year 1)
        df['date_ordinal'] = df['date'].apply(lambda x: x.toordinal())

        X = df[['date_ordinal']].values
        y = df['amount'].values

        # 4. Train Model
        model = LinearRegression()
        model.fit(X, y)

        # 5. Predict 30 days into the future from the last transaction
        last_date_ordinal = df['date_ordinal'].max()
        future_date = np.array([[last_date_ordinal + 30]])
        prediction = model.predict(future_date)[0]

        # 6. Smart Fallback Logic
        # If prediction is 0 or negative (common with small datasets), 
        # use the average spending plus a 10% "buffer" for a better UI experience.
        if prediction <= 0:
            avg_spend = df['amount'].mean()
            prediction = avg_spend * 1.10
            msg = "Prediction based on average spending trend."
        else:
            msg = "AI prediction generated using Linear Regression."

        return Response({
            "predicted_spending_next_month": round(float(prediction), 2),
            "data_points_used": len(df),
            "message": msg,
            "algorithm": "Time-Series Regression"
        })