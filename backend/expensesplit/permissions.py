from rest_framework import permissions

class IsGroupMember(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

class IsTransactionParticipant(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user == obj.payer or request.user in obj.participants.all()