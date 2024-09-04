import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Space, List } from 'antd';
import BaseLayout from '../components/BaseLayout';
import useIsMobile from "../services/ResponsiveService";
import { getAccessToken, refreshToken } from '../services/AuthService';

function TakeQuiz() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [answers, setAnswers] = useState([]);

    const isMobile = useIsMobile(1000);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flashcardsResponse = await axios.get(`/api/quiz/${quizId}/flashcards/`);
                setFlashcards(flashcardsResponse.data);
                console.log(flashcardsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [quizId]);

    const handleSubmitAnswer = () => {
        const correctAnswer = flashcards[currentIndex].term;
        if (userAnswer.toLowerCase() === flashcards[currentIndex].term.toLowerCase()) {
            setScore(score + 1);
        }

        setAnswers([
            ...answers, 
            { 
                userAnswer, 
                correctAnswer 
            }
        ]);

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
                <h2>Quiz Completed!</h2>
                <h3>Your score: {score} / {flashcards.length}</h3>
                {isMobile ? (
                <List
                    header={<h3>Results</h3>}
                    bordered
                    dataSource={answers}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div style={{ flex: 1, marginBottom: 8 }}>
                                <strong>Q{index + 1}: </strong>{flashcards[index].description}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ flex: 1 }}>
                                    <strong>Your Answer: </strong>{item.userAnswer}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>Correct Answer: </strong>{item.correctAnswer}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
                ) : (
                <List 
                    header={<h3>Results</h3>}
                    bordered
                    dataSource={answers}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div style={{ flex: 0.75 }}>
                                <strong>Q{index + 1}: </strong>{flashcards[index].description}
                            </div>
                            <div style={{ flex: 0.5 }}>
                                <strong>Your Answer: </strong>{item.userAnswer}
                            </div>
                            <div style={{ flex: 0.5 }}>
                                <strong>Correct Answer: </strong>{item.correctAnswer}
                            </div>
                        </List.Item>
                    )}
                />)}
                
                <Space style={{ marginTop: 20 }}>
                    <Button type="primary" size={size} onClick={handleSaveResults}>
                        Save Results
                    </Button>
                    <Button type="primary" danger size={size} onClick={() => navigate(`/quiz/${quizId}/`)}>
                        Discard Results
                    </Button>
                </Space>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
        <h3>{currentIndex + 1}/{flashcards.length}</h3>
        <h2>{flashcards[currentIndex]?.description}</h2>
        <Space>
            <Input 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)} 
                style={{width: 300}}
            /> 
            <Button type="primary" onClick={handleSubmitAnswer}>
                Submit
            </Button>
        </Space>
        </BaseLayout>
    );
}

export default TakeQuiz;
