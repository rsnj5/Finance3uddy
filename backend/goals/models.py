from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    current_amount=models.FloatField()
    target_amount=models.FloatField()
    target_date = models.DateField()
    completed = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}: {self.current_amount}/{self.target_amount}"
