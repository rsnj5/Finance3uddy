from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from dateutil.relativedelta import relativedelta  

class Due(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    due_date = models.DateField()
    amount = models.FloatField()
    to_whom = models.CharField(max_length=255)
    recurring = models.CharField(max_length=50, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ])
    next_reminder_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.next_reminder_date:
            self.next_reminder_date = self.created_at.date()
            super().save(update_fields=['next_reminder_date'])  

    def update_next_reminder_date(self):
        """ Updates next_reminder_date based on recurrence. """
        if not self.next_reminder_date:
            self.next_reminder_date = self.created_at.date()

        if self.recurring == 'daily':
            self.next_reminder_date += timedelta(days=1)
        elif self.recurring == 'weekly':
            self.next_reminder_date += timedelta(weeks=1)
        elif self.recurring == 'monthly':
            self.next_reminder_date += relativedelta(months=1)

        if self.next_reminder_date > self.due_date:
            self.next_reminder_date = None

        self.save(update_fields=['next_reminder_date'])

    def __str__(self):
        return f"{self.user.username} - {self.title}: {self.amount}"
