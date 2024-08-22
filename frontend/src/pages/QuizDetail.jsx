import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import FlashCard from '../components/FlashCard';
import { Button } from 'antd';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        axios.get(`/api/quiz/${id}/`)
            .then(response => {
                setQuiz(response.data);
                console.log(id)
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
    }, [id]);

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
                <Button type="primary">Learn</Button>
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
        </BaseLayout>
    );
}

export default QuizDetail;
