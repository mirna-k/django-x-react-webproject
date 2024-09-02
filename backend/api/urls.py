from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserProfileView.as_view(), name='user-profile'),
    path("my-quizzes/", views.MyQuizListCreate.as_view(), name="my-quiz-list"),
    path('liked-quizzes/', views.LikedQuizListView.as_view(), name='liked-quiz-list'),
    path('public-quizzes/', views.PublicQuizListCreate.as_view(), name="public-quiz-list"),
    path('create-quiz/', views.QuizCreateView.as_view(), name='create-quiz'),
    path("quiz/<int:pk>/", views.QuizDetailView.as_view(), name="quiz-detail"),
    path('quiz/<int:pk>/delete/', views.QuizDeleteView.as_view(), name='delete-quiz'),
    path("create-flashcards/<int:quizId>/", views.FlashcardCreateView.as_view(), name="create-flashcards"),
    path('flashcard/<int:id>/delete/', views.FlashcardDeleteView.as_view(), name='delete-flashcard'),
    path('quiz/<int:id>/flashcards/', views.FlashcardListView.as_view(), name="quiz-flashcards"),
    path('quiz-status-choices/', views.QuizStatusChoicesView.as_view(), name='quiz-status-choices'),
    path("quiz-results/", views.QuizResultCreateView.as_view(), name="quiz-results"),
    path('quiz/<int:quiz_id>/results/', views.QuizResultsListView.as_view(), name='quiz-results-list'),
    path('quiz/<int:pk>/like/', views.QuizLikeToggleView.as_view(), name='quiz-like-toggle'),
    path('quiz/<int:pk>/like-status/', views.QuizLikeStatusView.as_view(), name='quiz-like-status'),
]