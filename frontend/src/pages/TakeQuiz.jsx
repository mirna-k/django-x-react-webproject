import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Button, Input } from 'antd';
import BaseLayout from '../components/BaseLayout';
import { getAccessToken, refreshToken } from '../services/AuthService';

function TakeQuiz() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flashcardsResponse = await axios.get(`/api/quiz/${quizId}/flashcards/`);
                setFlashcards(flashcardsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
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

    const handleSaveResults = async () => {
        const accessToken = getAccessToken();
        const scorePercent = (score / flashcards.length) * 100;
        const roundedScorePercent = parseFloat(scorePercent.toFixed(2));
        try {
            await axios.post(`/api/quiz-results/`, { quiz: quizId, score: roundedScorePercent }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('Results submitted successfully');
            navigate(`/quiz/${quizId}/`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        await axios.post(`/api/quiz/${quizId}/submit/`, values, {
                            headers: { Authorization: `Bearer ${newToken}` }
                        });
                        console.log('Quiz submitted successfully after token refresh');
                        navigate(`/quiz/${quizId}/`);
                    } catch (retryError) {
                        console.error('Error submitting quiz after token refresh:', retryError);
                    }
                } else {
                    console.error('Unable to refresh token');
                }
            } else {
                console.error('Error submitting quiz:', error);
            }
        }
    };

    const [size, setSize] = useState('large');
    if (quizCompleted) {
        return (
            <BaseLayout>
            <div>
                <h2>Quiz Completed!</h2>
                <p>Your score: {score} / {flashcards.length}</p>
                <Button type="primary" size={size} onClick={handleSaveResults}>
                    Save Results
                </Button>
                <Button type="primary" danger size={size} onClick={() => navigate(`/quiz/${quizId}/`)}>
                    Discard Results
                </Button>
            </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
        <div>
            <h2>{flashcards[currentIndex]?.description}</h2>
            <Input 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)} 
                style={{width: 300}}
            /> 
            <Button type="primary" onClick={handleSubmitAnswer}>
                Submit
            </Button>
        </div>
        </BaseLayout>
    );
}

export default TakeQuiz;
