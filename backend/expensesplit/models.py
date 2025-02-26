from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    title = models.CharField(max_length=255)
    members = models.ManyToManyField(User,related_name="expense_groups")
   
   
    
class Transaction(models.Model):
    payer = models.ForeignKey(User, on_delete=models.CASCADE)
    amounts=models.FloatField()
    group= models.ForeignKey(Group, on_delete=models.CASCADE)
    participants=models.ManyToManyField(User,related_name="expense_transactions")
    created_at=models.DateTimeField(auto_now_add=True)

class Expenses(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group= models.ForeignKey(Group, on_delete=models.CASCADE)
    total_expense=models.FloatField(default=0.0)



   