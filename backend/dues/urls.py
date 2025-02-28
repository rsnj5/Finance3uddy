from django.urls import path
from .views import DueListCreateView, DueRetrieveUpdateDestroyView

urlpatterns = [
    path('', DueListCreateView.as_view(), name='due-list-create'),
    path('<int:pk>/', DueRetrieveUpdateDestroyView.as_view(), name='due-detail'),
]
