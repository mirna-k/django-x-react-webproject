import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import FlashCard from '../components/FlashCard';
import { Button } from 'antd';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [results, setResults] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get(`/api/quiz/${id}/`)
            .then(response => {
                setQuiz(response.data);
            })
            .catch(error => {
                console.error('Error fetching quiz details:', error);
            });

        axios.get(`/api/quiz/${id}/flashcards/`)
            .then(response => {
                setFlashcards(response.data);
            })
            .catch(error => {
                console.error('Error fetching flashcards:', error);
            });

        axios.get(`/api/quiz/${id}/results/`)
            .then(response => {
                setResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching quiz results:', error);
            });
    }, [id]);


    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await axios.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                return res.data.access;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };
    
    const deleteQuiz = async (id) => {
        let accessToken = localStorage.getItem(ACCESS_TOKEN);
    
        try {
            await axios.delete(`/api/quiz/${id}/delete/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigate('/');
            console.log('Quiz deleted successfully');
        } catch (error) {
            if (error.response && error.response.status === 401) { // Unauthorized
                const newToken = await refreshToken();
                if (newToken) {
                    accessToken = newToken;
                    try {
                        await axios.delete(`/api/quiz/${id}/delete/`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        console.log('Quiz deleted successfully after token refresh');
                        navigate('/');
                    } catch (retryError) {
                        console.error('Error deleting quiz after token refresh:', retryError);
                    }
                } else {
                    console.error('Unable to refresh token');
                }
            } else {
                console.error('Error deleting quiz:', error);
            }
        }
    };

    if (!quiz) return <div>Loading...</div>;

    const formattedDate = new Date(quiz.created_at).toDateString();

    return (
        <BaseLayout>
            <div>
                <p>Quiz created: {formattedDate}</p>
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>
                <p>Field: {quiz.field}</p>
                <p>Status: {quiz.status}</p>
                <Button onClick={() => deleteQuiz(quiz.id)} danger>Delete Quiz</Button>
                <Link to={`/quiz/${quiz.id}/take`}>
                    <Button type="primary">Take Quiz</Button>
                </Link>
                <h3>Flashcards</h3>
                <ul>
                    {flashcards.map((flashcard) => (
                        <FlashCard 
                            flashcard={flashcard} 
                            key={flashcard.id} 
                        />
                    ))}
                </ul>
            </div>
            <div>
            <h2>Quiz Results</h2>
            <ul>
                {results.map(result => (
                    <li key={result.id}>
                        User: {result.user.username}, Score: {result.score}%, Date: {new Date(result.completed_at).toDateString()}
                    </li>
                ))}
            </ul>
        </div>
        </BaseLayout>
    );
}

export default QuizDetail;
