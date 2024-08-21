import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import BaseLayout from '../components/BaseLayout';

function CreateFlashcards() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([{ quiz: quizId, term: '', description: '' }]);

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
            })
            .catch((err) => alert(err));
        });        
    };

    return (
        <BaseLayout>
            <div>
                <h1>Create Flashcards for Quiz {quizId}</h1>
                <form onSubmit={handleSubmit}>
                    {flashcards.map((flashcard, index) => (
                        <div key={index}>
                            <label>Term</label>
                            <input
                                type="text"
                                name="term"
                                value={flashcard.term}
                                onChange={(e) => handleFlashcardChange(index, e)}
                                required
                            />
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={flashcard.description}
                                onChange={(e) => handleFlashcardChange(index, e)}
                                required
                            ></textarea>
                        </div>
                    ))}
                    <button type="button" onClick={addFlashcard}>Add Flashcard</button>
                    <input type="submit" value="Create Flashcards" />
                </form>
            </div>
        </BaseLayout>
    );
}

export default CreateFlashcards;
