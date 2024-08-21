import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    
    useEffect(() => {
        axios.get(`/api/quiz/${id}/`)
            .then(response => {
                setQuiz(response.data);
            })
            .catch(error => {
                console.error('Error fetching quiz details:', error);
            });
    }, [id]);

    if (!quiz) return <div>Loading...</div>;
    const formattedDate = new Date(quiz.created_at).toDateString();
    return (
        <div>
            <p>Quiz created at: {formattedDate}</p>
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <p>Field: {quiz.field}</p>
            <p>Status: {quiz.status}</p>
            <h3>Flashcards</h3>
            <ul>
                {quiz.flashcards.map((flashcard) => (
                    <li key={flashcard.id}>
                        <strong>Term:</strong> {flashcard.term}<br />
                        <strong>Description:</strong> {flashcard.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuizDetail;
