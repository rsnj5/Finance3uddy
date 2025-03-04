from rest_framework import generics, permissions
from django_filters import rest_framework as filters
from .models import Loan,LoanApplication
from .serializers import LoanSerializer,LoanApplicationSerializer

class LoanFilter(filters.FilterSet):
    min_interest_rate = filters.NumberFilter(field_name="interest_rate", lookup_expr="gte")
    max_interest_rate = filters.NumberFilter(field_name="interest_rate", lookup_expr="lte")
    min_loan_amount = filters.NumberFilter(field_name="max_loan_amount", lookup_expr="gte")
    max_loan_amount = filters.NumberFilter(field_name="max_loan_amount", lookup_expr="lte")
    min_tenure = filters.NumberFilter(field_name="tenure", lookup_expr="gte")
    max_tenure = filters.NumberFilter(field_name="tenure", lookup_expr="lte")
    category = filters.CharFilter(field_name="category", lookup_expr="iexact")

    class Meta:
        model = Loan
        fields = ["min_interest_rate", "max_interest_rate", "min_loan_amount", "max_loan_amount", "min_tenure", "max_tenure", "category"]

class LoanListView(generics.ListAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = LoanFilter
    
class LoanApplicationCreateView(generics.CreateAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class LoanApplicationListView(generics.ListAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoanApplication.objects.filter(user=self.request.user)