from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import RetrieveAPIView
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.http import JsonResponse
import requests
import json

from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(user.password)  
        user.save()

token_obtain_view = TokenObtainPairView.as_view()
token_refresh_view = TokenRefreshView.as_view()

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})

from django.contrib.auth.models import User

@csrf_exempt
def google_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            access_token = data.get('access_token')

            if not access_token:
                return JsonResponse({"error": "Access token is required"}, status=400)

            google_response = requests.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={access_token}"
            )

            if google_response.status_code != 200:
                return JsonResponse({
                    "error": "Invalid Google token", 
                    "details": google_response.text
                }, status=400)

            google_data = google_response.json()
            email = google_data.get("email")
            base_username = email.split('@')[0]
            username = f"{base_username}"
            
            if not email:
                return JsonResponse({"error": "Google account has no email"}, status=400)

            user, created = User.objects.get_or_create(username=username, defaults={"email": email})

            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            
            tokens = get_tokens_for_user(user)
            return JsonResponse(tokens)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)