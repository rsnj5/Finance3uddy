from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Group, Transaction
from .serializers import GroupSerializer, TransactionSerializer
from rest_framework import status
from rest_framework.generics import RetrieveAPIView

class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        members_data = self.request.data.get("members", [])
        group = serializer.save()
        group.members.add(self.request.user)  # Add the requesting user as a member

        if members_data:
            members = User.objects.filter(id__in=members_data)
            if members.count() != len(members_data):
                raise serializers.ValidationError("One or more members do not exist.")
            group.members.add(*members)

class AddMembersToGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        group = get_object_or_404(Group, id=id)

        if request.user not in group.members.all():
            return Response({"error": "You are not authorized to add members."}, status=403)

        members_data = request.data.get("members", [])  # Expecting a list of user IDs

        if not members_data:
            return Response({"error": "No members provided."}, status=400)

        members = User.objects.filter(id__in=members_data)
        if members.count() != len(members_data):
            return Response({"error": "One or more users not found."}, status=400)

        group.members.add(*members)
        return Response({"message": "Members added successfully.", "members": [m.username for m in members]})

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs["id"]
        return Transaction.objects.filter(id=id)

    def perform_create(self, serializer):
        id = self.kwargs["id"]
        group = get_object_or_404(Group, id=id)

        if self.request.user not in group.members.all():
            raise serializers.ValidationError("You are not a member of this group.")

        participants_data = self.request.data.get("participants", [])
        participants = User.objects.filter(id__in=participants_data)

        if participants.count() != len(participants_data):
            raise serializers.ValidationError("One or more participants do not exist.")

        transaction = serializer.save(group=group, payer=self.request.user)
        transaction.participants.add(*participants)

class GroupExpenseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        group = get_object_or_404(Group, id=id)
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

class MarkGroupAsCompletedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        group = get_object_or_404(Group, id=id)

        if request.user not in group.members.all():
            return Response({"error": "You are not authorized to mark this group as completed."}, status=status.HTTP_403_FORBIDDEN)

        group.completed = True
        group.save()

        return Response({"message": "Group marked as completed."})

class AuthorizedUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        user_data = [{"id": user.id, "username": user.username} for user in users]
        return Response(user_data)

class GroupDetailView(RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = "id" 