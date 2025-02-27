from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Group, Transaction
from .serializers import GroupSerializer, TransactionSerializer

class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.groups.all()

    def perform_create(self, serializer):
        members_data = self.request.data.get("members", [])
        group = serializer.save()
        group.members.add(self.request.user)  # Add creator
        members = User.objects.filter(id__in=members_data)
        group.members.add(*members)

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs["group_id"]
        return Transaction.objects.filter(group_id=group_id)

    def perform_create(self, serializer):
        participants_data = self.request.data.get("participants", [])
        transaction = serializer.save(payer=self.request.user)
        participants = User.objects.filter(id__in=participants_data)
        transaction.participants.add(*participants)

class GroupExpenseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        transactions = Transaction.objects.filter(group=group)

        member_expenses = {
            member.id: {"name": member.username, "paid": 0, "owed": 0, "net_balance": 0}
            for member in group.members.all()
        }

        for transaction in transactions:
            payer_id = transaction.payer.id
            amount = transaction.amount
            participants = transaction.participants.all()
            num_participants = participants.count()

            member_expenses[payer_id]["paid"] += amount

            if num_participants > 0:
                share = amount / num_participants
                for participant in participants:
                    member_expenses[participant.id]["owed"] += share

        for member_id, data in member_expenses.items():
            data["net_balance"] = data["paid"] - data["owed"]

        return Response({"group": group.name, "expenses": list(member_expenses.values())})

