import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../components/BaseLayout";
import axios from 'axios';
import { Space } from "antd";

function CreateQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [field, setField] = useState("art");
    const [status, setStatus] = useState("public");
    const [statusOptions, setStatusOptions] = useState([]);
    const navigate = useNavigate();

    const fieldOptions = [
        { value: 'art', label: 'Art' },
        { value: 'business', label: 'Business' },
        { value: 'computers', label: 'Computers' },
        { value: 'education', label: 'Education' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'finance', label: 'Finance' },
        { value: 'law', label: 'Law' },
        { value: 'literature', label: 'Literature' },
        { value: 'medicine', label: 'Medicine' },
        { value: 'science', label: 'Science' },
        { value: 'social_sciences', label: 'Social Sciences' },
        { value: 'technology', label: 'Technology' },
    ];    

    
    useEffect(() => {
        getQuizStatusChoices();
    }, []);

    const createQuiz = (e) => {
        e.preventDefault();
        api.post('/api/create-quiz/', {
            title,
            description,
            field,
            status
        })
        .then((res) => {
            alert("Quiz created. Redirecting to create flashcards...");
            setTitle("");
            setDescription("");
            setField("art");
            setStatus("public");

            const quizId = res.data.id;
            navigate(`/create-flashcards/${quizId}`);
        })
        .catch((err) => alert(err));
    };

    const getQuizStatusChoices = () => {
        axios.get('/api/quiz-status-choices/')
            .then(response => {
                setStatusOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching status options:', error);
            });
    };
    
    return (
        <BaseLayout>
            <h2>Create Quiz</h2>
            <form onSubmit={createQuiz}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br />
                <label htmlFor="description">Description:</label>
                <br />
                <textarea
                    id="description"
                    name="description"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></textarea>
                <br />
                <Space>
                    <label htmlFor="field">Field:</label>
                    <br />
                    <select
                        id="field"
                        name="field"
                        onChange={(e) => setField(e.target.value)}
                        value={field}
                    >
                        {fieldOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Space>
                <br />
                <Space>
                    <label htmlFor="status">Status:</label>
                    <br />
                    <select
                        id="status"
                        name="status"
                        required
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        {statusOptions.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </Space>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </BaseLayout>
    );
}

export default CreateQuiz;
