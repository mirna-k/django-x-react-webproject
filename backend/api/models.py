from django.db import models
from django.contrib.auth.models import User
    
class Quiz(models.Model):
    class Status(models.TextChoices):
        PUBLIC = 'public', "Public"
        PRIVATE = 'private', "Private"

    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quizes")
    field = models.CharField(max_length=100)
    status = models.CharField(
        max_length=100, 
        choices=Status.choices,
        default=Status.PUBLIC,
    )

    def __str__(self):
        return self.title


class Flashcard(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    term = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.term
    

class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}"