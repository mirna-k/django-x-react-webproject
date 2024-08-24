from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, QuizSerializer, FlashcardSerializer, QuizResultSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Quiz, Flashcard, QuizResult
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, PermissionDenied

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


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


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]


class QuizDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
            quiz.delete()
            return Response({'message': 'Quiz deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)


class FlashcardCreateView(generics.CreateAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [AllowAny]


class FlashcardDeleteView(generics.DestroyAPIView):
    queryset = Flashcard.objects.all()
    permission_classes = [AllowAny]
    
    def perform_destroy(self, instance):
        if instance.quiz.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this flashcard.")
        super().perform_destroy(instance)


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
    

class QuizResultCreateView(generics.CreateAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizResultsListView(generics.ListAPIView):
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return QuizResult.objects.filter(quiz_id=quiz_id).order_by('score')
