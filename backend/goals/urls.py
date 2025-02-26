from django.urls import path
from .views import GoalListCreateView, GoalRetrieveUpdateDestroyView

urlpatterns = [
    path('', GoalListCreateView.as_view(), name='goal-list-create'),
    path('<int:pk>/', GoalRetrieveUpdateDestroyView.as_view(), name='goal-detail'),
]