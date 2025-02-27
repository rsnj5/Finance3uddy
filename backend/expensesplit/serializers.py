from rest_framework import serializers
from .models import Group, Transaction
from django.contrib.auth.models import User

from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'members']  
class TransactionSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Transaction
        fields = "__all__"

