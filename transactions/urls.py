from django.urls import path
from .views import TransactionListCreate, TransactionDetail, BudgetForecastView, CategoryList

urlpatterns = [
    path('transactions/', TransactionListCreate.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('forecast/', BudgetForecastView.as_view(), name='budget-forecast'),
]