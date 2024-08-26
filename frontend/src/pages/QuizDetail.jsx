import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import FlashCard from '../components/FlashCard';
import { Button, Progress, Space } from 'antd';
import { capitalize } from '../constants';
import { getAccessToken, refreshToken, fetchUser } from '../services/AuthService';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [results, setResults] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

      const conicColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7',
      };

    useEffect(() => {const fetchData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);

                const quizResponse = await axios.get(`/api/quiz/${id}/`);
                setQuiz(quizResponse.data);

                const flashcardsResponse = await axios.get(`/api/quiz/${id}/flashcards/`);
                setFlashcards(flashcardsResponse.data);

                const resultsResponse = await axios.get(`/api/quiz/${id}/results/`);
                setResults(resultsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const deleteQuiz = async (id) => {
        let accessToken = getAccessToken();
        try {
            await axios.delete(`/api/quiz/${id}/delete/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('Quiz deleted successfully');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    accessToken = newToken;
                    try {
                        await axios.delete(`/api/quiz/${id}/delete/`, {
                            headers: { Authorization: `Bearer ${accessToken}` }
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

    const isAuthor = user.username === quiz.author_username;

    if (!isAuthor && quiz.status !== 'public') {
        return <div>You do not have permission to view this quiz.</div>;
    }

    return (
        <BaseLayout>
            <div>
                <p>Quiz created: {formattedDate}</p>
                <h2>{quiz.title}</h2>
                <p>Author: {quiz.author_username}</p>
                <p>{quiz.description}</p>
                <p>Field: {capitalize(quiz.field)}</p>
                <p>Status: {capitalize(quiz.status)}</p>

                {isAuthor && (
                    <>
                        <Button onClick={() => deleteQuiz(quiz.id)} danger>Delete Quiz</Button>
                        <Link to={`/create-flashcards/${quiz.id}`}>
                            <Button type="primary">Add Flashcards</Button>
                        </Link>
                    </>
                )}

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
                {results.length > 0 ? (
                    <ul>
                    {results.map(result => (
                        <Space key={result.id}  size="middle">
                            <p>User: {result.taker_username} </p>
                            <Progress 
                                percent={result.score}
                                strokeColor={conicColors} 
                                style={{width: 500}}
                            />
                            <p>Date: {new Date(result.completed_at).toDateString()}</p>
                        </Space>  
                    ))}
                </ul>
                    
                ) : (
                    <p>No results yet.</p>
                )}
            </div>
             
        </BaseLayout>
    );
}

export default QuizDetail;
