from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Quiz, Flashcard

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "quiz", "term", "description"]


class QuizSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "title", "description", "created_at", "author", "field", "status", "flashcards"]
        extra_kwargs = {"author": {"read_only": True}}

    
