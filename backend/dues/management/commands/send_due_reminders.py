from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from dues.models import Due

class Command(BaseCommand):
    help = 'Sends due reminders to users based on recurrence and updates next_reminder_date.'

    def handle(self, *args, **options):
        # Get all dues with a next_reminder_date <= today
        dues = Due.objects.filter(next_reminder_date__lte=timezone.now().date())

        for due in dues:
            # Send email reminder
            send_mail(
                subject=f"Reminder: {due.title} is due",
                message=f"Hello {due.user.username},\n\nThis is a reminder for your due: {due.title}.\nAmount: {due.amount}\nDue Date: {due.due_date}\n\nThank you!",
                from_email='krishagarwal336@gmail.com',  # Replace with your email
                recipient_list=[due.user.email],  # Send to the user's email
                fail_silently=False,
            )

            # Update the next_reminder_date based on recurrence
            due.update_next_reminder_date()

        self.stdout.write(self.style.SUCCESS('Successfully sent due reminders.'))
