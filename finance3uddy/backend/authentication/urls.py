from django.urls import path
from .views import RegisterUserView, token_obtain_view, token_refresh_view

urlpatterns = [
    path('signup/', RegisterUserView.as_view(), name='signup'),
    path('login/', token_obtain_view, name='login'),
    path('refresh/', token_refresh_view, name='token_refresh'),
]
