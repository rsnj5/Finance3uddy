from rest_framework import permissions

class IsGroupMember(permissions.BasePermission):
    """
    Custom permission to allow only members of a group to access its data.
    """

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

class IsTransactionParticipant(permissions.BasePermission):
    """
    Custom permission to allow only participants of a transaction to view or modify it.
    """

    def has_object_permission(self, request, view, obj):
        return request.user == obj.payer or request.user in obj.participants.all()

