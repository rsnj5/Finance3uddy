from django.db import models
from django.contrib.auth.models import User


class Loan(models.Model):
    CATEGORY_CHOICES = [
        ("GOLD", "Gold Loan"),
        ("BUSINESS", "Business Loan"),
        ("EDUCATION", "Education Loan"),
        ("CAR", "Car Loan"),
        ("PERSONAL", "Personal Loan"),
        ("HOME", "Home Loan"),
    ]

    name = models.CharField(max_length=255)
    interest_rate = models.FloatField()
    max_loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    min_credit_score = models.IntegerField()
    tenure = models.IntegerField()  # in months
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="PERSONAL")

    def __str__(self):
        return self.name

class LoanApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="Pending")
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.loan.name}"