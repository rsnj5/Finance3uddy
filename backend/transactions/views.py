from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.views import APIView
from django.db.models.functions import TruncWeek, TruncMonth, TruncYear
from django.db.models import Sum
from django.db import models
from rest_framework.response import Response



from .permissions import IsOwner

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class WeeklyTransactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = (
            Transaction.objects.filter(user=request.user)
            .annotate(week=TruncWeek('date'))
            .values('week')
            .annotate(total_income=Sum('amount', filter=models.Q(type='income')),
                      total_expense=Sum('amount', filter=models.Q(type='expense')))
            .order_by('week')
        )
        return Response(transactions)

class MonthlyTransactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = (
            Transaction.objects.filter(user=request.user)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_income=Sum('amount', filter=models.Q(type='income')),
                      total_expense=Sum('amount', filter=models.Q(type='expense')))
            .order_by('month')
        )
        return Response(transactions)

class YearlyTransactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = (
            Transaction.objects.filter(user=request.user)
            .annotate(year=TruncYear('date'))
            .values('year')
            .annotate(total_income=Sum('amount', filter=models.Q(type='income')),
                      total_expense=Sum('amount', filter=models.Q(type='expense')))
            .order_by('year')
        )
        return Response(transactions)

class CategoryTransactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = (
            Transaction.objects.filter(user=request.user)
            .values('category')
            .annotate(total_income=Sum('amount', filter=models.Q(type='income')),
                      total_expense=Sum('amount', filter=models.Q(type='expense')))
            .order_by('category')
        )
        return Response(transactions)
    


