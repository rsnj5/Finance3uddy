from rest_framework import serializers
from .models import Group, Transaction
from django.contrib.auth.models import User

class GroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = Group
        fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Transaction
        fields = "__all__"

