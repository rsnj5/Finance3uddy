from django.urls import path
from .views import LoanListView, LoanApplicationCreateView, LoanApplicationListView

urlpatterns = [
    path("loans/", LoanListView.as_view(), name="loan-list"),
    path("apply/", LoanApplicationCreateView.as_view(), name="loan-apply"),
    path("applications/", LoanApplicationListView.as_view(), name="loan-applications"),
]