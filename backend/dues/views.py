from rest_framework import generics, permissions
from .models import Due
from .serializers import DueSerializer
from .permissions import IsOwner

class DueListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create dues for the authenticated user.
    """
    serializer_class = DueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Due.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        if not due.next_reminder_date:
            due.next_reminder_date = due.created_at.date()
            due.save()

class DueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific due.
    """
    serializer_class = DueSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Due.objects.filter(user=self.request.user)
