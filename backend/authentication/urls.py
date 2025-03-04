from django.urls import path
from .views import RegisterUserView, token_obtain_view, token_refresh_view,UserDetailView,get_csrf_token,google_login

urlpatterns = [
    path('signup/', RegisterUserView.as_view(), name='signup'),
    path('login/', token_obtain_view, name='login'),
    path('refresh/', token_refresh_view, name='token_refresh'),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path('google/', google_login, name='google_login'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    
]
