from rest_framework import serializers
from .models import Loan, LoanApplication

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = "__all__"

class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = "__all__"
        read_only_fields = ["user", "applied_at", "status"]