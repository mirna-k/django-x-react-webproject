from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Quiz, Flashcard, QuizResult, QuizLike
from .serializers import UserSerializer, QuizSerializer, FlashcardSerializer, QuizResultSerializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, PermissionDenied

class IsAuthor(BasePermission):
    """
    Custom permission to only allow the author of a quiz to modify or delete it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'username': user.username,
        }
        return Response(user_data)


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


class PublicQuizListCreate(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Quiz.objects.filter(status='public')
    

class LikedQuizListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer

    def get_queryset(self):
        user = self.request.user
        liked_quizzes = QuizLike.objects.filter(user=user).values_list('quiz', flat=True)
        return Quiz.objects.filter(id__in=liked_quizzes)


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
    permission_classes = [IsAuthenticated, IsAuthor]

    def delete(self, request, pk, format=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
            if quiz.author != request.user:
                return Response({'error': 'You do not have permission to delete this quiz'}, status=status.HTTP_403_FORBIDDEN)
            
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
        return QuizResult.objects.filter(quiz_id=quiz_id).order_by('-score')


class QuizLikeStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        liked = QuizLike.objects.filter(user=user, quiz_id=pk).exists()
        total_likes = QuizLike.objects.filter(quiz_id=pk).count()
        return Response({'liked': liked, 'total_likes': total_likes})
    

class QuizLikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        user = request.user
        quiz = Quiz.objects.get(pk=pk)

        quiz_like, created = QuizLike.objects.get_or_create(user=user, quiz=quiz)

        if not created:
            quiz_like.delete()
            return Response({'liked': False}, status=status.HTTP_200_OK)

        return Response({'liked': True}, status=status.HTTP_200_OK)
    