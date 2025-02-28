from rest_framework import serializers
from .models import Group, Transaction
from django.contrib.auth.models import User

class GroupSerializer(serializers.ModelSerializer):
<<<<<<< Updated upstream
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'completed']
=======
    members = serializers.SlugRelatedField(
        slug_field="username",  # Use usernames instead of IDs
        queryset=User.objects.all(),
        many=True,
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'members']

    def create(self, validated_data):
        members_data = validated_data.pop('members', [])  # Extract members data
        group = Group.objects.create(**validated_data)  # Create the group
        group.members.add(*members_data)  # Add members to the group
        return group

    def update(self, instance, validated_data):
        members_data = validated_data.pop('members', [])  # Extract members data
        instance = super().update(instance, validated_data)  # Update the group
        instance.members.set(members_data)  # Set the new members
        return instance
>>>>>>> Stashed changes

class TransactionSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Transaction
<<<<<<< Updated upstream
        fields = "__all__"
=======
        fields = "__all__"
>>>>>>> Stashed changes
