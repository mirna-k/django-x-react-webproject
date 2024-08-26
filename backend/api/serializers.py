from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Quiz, Flashcard, QuizResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "quiz", "term", "description"]


class QuizSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "title", "description", "created_at", "author_username", "field", "status", "flashcards"]
        extra_kwargs = {"author": {"read_only": True}}

    
class QuizResultSerializer(serializers.ModelSerializer):
    taker_username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = QuizResult
        fields = ['id', 'taker_username', 'quiz', 'score', 'completed_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'completed_at': {'read_only': True}
        }