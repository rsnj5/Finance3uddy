from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name="expense_groups")
    completed = models.BooleanField(default=False)  

    
class Transaction(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="transactions")
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    participants = models.ManyToManyField(User, related_name="expenses")
    created_at = models.DateTimeField(auto_now_add=True)

