import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import BaseLayout from '../components/BaseLayout';
import { Space, Select, Input, Button} from "antd";

function CreateFlashcards() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([{ quiz: quizId, term: '', description: '' }]);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        api.get(`/api/quiz/${quizId}/`)
            .then(response => {
                setQuiz(response.data);
            })
            .catch(error => {
                console.error('Error fetching quiz details:', error);
            });
    }, [quizId]);

    const navigate = useNavigate();

    const handleFlashcardChange = (index, e) => {
        const newFlashcards = flashcards.map((flashcard, fIndex) => {
            if (index !== fIndex) return flashcard;
            return { ...flashcard, [e.target.name]: e.target.value };
        });
        setFlashcards(newFlashcards);
    };

    const addFlashcard = () => {
        setFlashcards([...flashcards, { quiz: quizId, term: '', description: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        flashcards.forEach((flashcard) => {
            api.post(`/api/create-flashcards/${quizId}/`, flashcard)
            .then((res) => {
                console.log('Flashcards created successfully:', res.data);
                navigate(`/quiz/${quizId}/`);
            })
            .catch((err) => alert(err));
        });        
    };

    const { TextArea } = Input;

    return (
        <BaseLayout>
            <div>
                {quiz ? <h1>{quiz.title}</h1> : <p>Loading quiz details...</p>}
                <h2>Create Flashcards</h2>
                <form onSubmit={handleSubmit}>
                    {flashcards.map((flashcard, index) => (
                        <div key={index}>
                            <label>Term</label>
                            <Input name="term" value={flashcard.term} onChange={(e) => handleFlashcardChange(index, e)} /> 
                            <label>Description</label>
                            <TextArea name="description" value={flashcard.description} showCount maxLength={200} onChange={(e) => handleFlashcardChange(index, e) }
                                style={{
                                    height: 120,
                                    resize: 'none',
                                }}
                            />
                        </div>
                    ))}
                    <Button type="primary" onClick={addFlashcard} size="small">Add Flashcard</Button>
                    <input type="submit" value="Create Flashcards" />
                </form>
            </div>
        </BaseLayout>
    );
}

export default CreateFlashcards;
