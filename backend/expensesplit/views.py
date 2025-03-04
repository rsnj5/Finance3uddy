from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Group, Transaction
from .serializers import GroupSerializer, TransactionSerializer
from rest_framework import status
from rest_framework.generics import RetrieveAPIView

class AuthorizedUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        user_data = [{"id": user.id, "username": user.username} for user in users]
        return Response(user_data)

class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        members_data = self.request.data.get("members", [])  
        group = serializer.save()
        group.members.add(self.request.user)  

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

        members_data = request.data.get("members", [])  
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
        group_id = self.kwargs["id"]
        return Transaction.objects.filter(group_id=group_id)

    def perform_create(self, serializer):
        group_id = self.kwargs["id"]
        group = get_object_or_404(Group, id=group_id)

        if self.request.user not in group.members.all():
            raise serializers.ValidationError("You are not a member of this group.")

        payer_id = self.request.data.get("payer")
        if not payer_id:
            raise serializers.ValidationError("Payer is required.")

        payer = User.objects.filter(id=payer_id).first()
        if not payer or payer not in group.members.all():
            raise serializers.ValidationError("Invalid payer.")

        participants_data = self.request.data.get("participants", [])
        participants = User.objects.filter(id__in=participants_data)

        if participants.count() != len(participants_data):
            raise serializers.ValidationError("One or more participants do not exist.")

        transaction = serializer.save(group=group, payer=payer)
        transaction.participants.add(*participants)

class GroupExpenseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        group = get_object_or_404(Group, id=id)

        if request.user not in group.members.all():
            return Response({"error": "You are not a member of this group."}, status=status.HTTP_403_FORBIDDEN)

        transactions = Transaction.objects.filter(group=group)

        debts = {
            debtor.id: {creditor.id: 0 for creditor in group.members.all() if creditor.id != debtor.id}
            for debtor in group.members.all()
        }

        for transaction in transactions:
            payer_id = transaction.payer.id
            amount = transaction.amount
            participants = transaction.participants.all()

            if participants.count() > 0:
                share = amount / participants.count()
                for participant in participants:
                    if participant.id != payer_id:

                        debts[participant.id][payer_id] += share

        debt_summary = []
        for debtor_id, debt_to_others in debts.items():
            debtor = User.objects.get(id=debtor_id)
            for creditor_id, amount in debt_to_others.items():
                if amount > 0:
                    creditor = User.objects.get(id=creditor_id)
                    debt_summary.append({
                        "debtor": debtor.username,
                        "creditor": creditor.username,
                        "amount": round(amount, 2),
                    })

        return Response({
            "group": group.name,
            "debts": debt_summary,
        })

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