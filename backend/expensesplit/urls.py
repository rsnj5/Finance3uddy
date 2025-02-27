from django.urls import path
from .views import GroupListCreateView, TransactionListCreateView, GroupExpenseView

urlpatterns = [
    path("groups/", GroupListCreateView.as_view(), name="group-list"),
    path("groups/<int:group_id>/transactions/", TransactionListCreateView.as_view(), name="transaction-list"),
    path("groups/<int:group_id>/expenses/", GroupExpenseView.as_view(), name="group-expenses"),
]

