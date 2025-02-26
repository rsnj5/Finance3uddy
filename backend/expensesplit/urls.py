from django.urls import path
from .views import TransactionListCreateView, TransactionRetrieveUpdateDestroyView,ExpenseListView,GroupListCreateView,expensesplit_home


urlpatterns = [
    path("groups/", GroupListCreateView.as_view(), name='group-list-create'),
    path("transactions/", TransactionListCreateView.as_view(), name='transaction-list-create'),
    path("transactions/<int:pk>/", TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    path("expenses/", ExpenseListView.as_view(), name="expense-list"),


]

