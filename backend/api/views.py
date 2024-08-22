from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer, QuizSerializer, FlashcardSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Quiz, Flashcard
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    

class MyQuizListCreate(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Quiz.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FlashcardCreateView(generics.CreateAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [AllowAny]


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]


class FlashcardListView(generics.ListAPIView):
    serializer_class = FlashcardSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        quiz_id = self.kwargs.get('id')
        try:
            Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise NotFound("Quiz not found.")

        return Flashcard.objects.filter(quiz_id=quiz_id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class QuizStatusChoicesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        status_choices = Quiz.Status.choices
        return Response(status_choices)
    