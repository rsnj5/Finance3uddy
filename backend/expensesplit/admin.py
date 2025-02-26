from django.contrib import admin
from .models import Group,Transaction,Expenses

admin.site.register(Group)
admin.site.register(Transaction)
admin.site.register(Expenses)

