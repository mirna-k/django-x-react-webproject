import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'antd';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function TakeQuiz() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const navigate = useNavigate();

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        axios.get(`/api/quiz/${quizId}/flashcards/`)
            .then(response => setFlashcards(response.data))
            .catch(error => console.error('Error fetching flashcards:', error));
    }, [quizId]);

    const handleSubmitAnswer = () => {
        if (userAnswer.toLowerCase() === flashcards[currentIndex].term.toLowerCase()) {
            setScore(score + 1);
        }

        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
        } else {
            setQuizCompleted(true);
        }
    };

    const handleSaveResults = () => {
        const csrftoken = getCookie('csrftoken');

        const scorePercent = (score / flashcards.length) * 100;
        const roundedScorePercent = parseFloat(scorePercent.toFixed(2));

        axios.post(
            `/api/quiz-results/`, 
            { quiz: quizId, score: roundedScorePercent }, 
            { headers: { 'X-CSRFToken': csrftoken } }
        )
            .then(response => {
                console.log('Results saved:', response.data);
                navigate(`/quiz/${quizId}/`);
            })
            .catch(error => console.error('Error saving results:', error));
    };

    const [size, setSize] = useState('large');
    if (quizCompleted) {
        return (
            <div>
                <h2>Quiz Completed!</h2>
                <p>Your score: {score} / {flashcards.length}</p>
                <Button type="primary" size={size} onClick={handleSaveResults}>
                    Save Results
                </Button>
                <button onClick={handleSaveResults}>Save Results</button>
            </div>
        );
    }

    return (
        <div>
            <h2>{flashcards[currentIndex]?.description}</h2>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
            />
            <Button type="primary" onClick={handleSubmitAnswer}>
                    Submit
            </Button>
        </div>
    );
}

export default TakeQuiz;
