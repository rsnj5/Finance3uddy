from rest_framework import generics, permissions
from .models import Goal
from .serializers import GoalSerializer
from .permissions import IsOwner

class GoalListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create goals for the authenticated user.
    """
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific goal.
    """
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)