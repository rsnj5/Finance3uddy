from rest_framework import serializers
from .models import Due

class DueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Due
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
