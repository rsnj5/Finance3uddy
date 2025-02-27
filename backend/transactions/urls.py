from django.urls import path
from .views import TransactionListCreateView, TransactionRetrieveUpdateDestroyView,WeeklyTransactionView,MonthlyTransactionView,YearlyTransactionView,CategoryTransactionView

urlpatterns = [
    
    path('', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('<int:pk>/', TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    path('weekly/', WeeklyTransactionView.as_view(), name='weekly-transactions'),
    path('monthly/', MonthlyTransactionView.as_view(), name='monthly-transactions'),
    path('yearly/', YearlyTransactionView.as_view(), name='yearly-transactions'),
    path('category/', CategoryTransactionView.as_view(), name='category-transactions'),
]


