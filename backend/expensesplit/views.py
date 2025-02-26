from django.http import JsonResponse
from rest_framework import generics, permissions
from .models import Group,Transaction,Expenses
from .serializers import GroupSerializer,TransactionSerializer,ExpensesSerializer
from .permissions import IsOwner

def expensesplit_home(request):
    return JsonResponse({"message": "Welcome to Expense Split API!"})


class GroupListCreateView(generics.ListCreateAPIView):
   
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        group=serializer.save()
        group.members.add(self.request.user)

class TransactionListCreateView(generics.ListCreateAPIView):
   
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return Transaction.objects.filter(payer=self.request.user)

    def perform_create(self, serializer):
        payer=self.request.user
        amount=serializer.validated_data["amounts"]
        group=serializer.validated_data["group"]
        participants=serializer.validated_data["participants"]

        transaction=serializer.save(payer=payer)

        share=amount/len(participants)
        for user in participants:
            expense,created=Expenses.objects.get_or_create(user=user,group=group)
            expense.total_expense+=share
            expense.save()

class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
   
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Transaction.objects.filter(payer=self.request.user)
    
class ExpenseListView(generics.ListAPIView):
   
    serializer_class = ExpensesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expenses.objects.filter(user=self.request.user)