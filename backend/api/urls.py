from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("my-quizes/", views.MyQuizListCreate.as_view(), name="my-quiz-list"),
    path('create-quiz/', views.QuizCreateView.as_view(), name='create-quiz'),
    path("quiz/<int:pk>/", views.QuizDetailView.as_view(), name="quiz-detail"),
    path("create-flashcards/<int:quizId>/", views.FlashcardCreateView.as_view(), name="create-flashcards"),
    path('quiz-status-choices/', views.QuizStatusChoicesView.as_view(), name='quiz-status-choices'),
]