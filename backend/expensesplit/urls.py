from django.urls import path
from .views import GroupListCreateView, TransactionListCreateView, GroupExpenseView, AddMembersToGroupView, MarkGroupAsCompletedView, GroupDetailView

urlpatterns = [
    path("groups/", GroupListCreateView.as_view(), name="group-list"),
    path("groups/<int:id>/transactions/", TransactionListCreateView.as_view(), name="transaction-list"),
    path("groups/<int:id>/expenses/", GroupExpenseView.as_view(), name="group-expenses"),
    path("groups/<int:id>/add_members/", AddMembersToGroupView.as_view(), name="add-members-to-group"),
    path("groups/<int:id>/complete/", MarkGroupAsCompletedView.as_view(), name="mark-group-completed"),
    path("groups/<int:id>/", GroupDetailView.as_view(), name="group-detail"),

]