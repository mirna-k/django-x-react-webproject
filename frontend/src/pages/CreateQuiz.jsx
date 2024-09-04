import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../components/BaseLayout";
import axios from 'axios';
import { Space, Select, Input} from "antd";
import '../styles/Form.css'

function CreateQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [field, setField] = useState("art");
    const [status, setStatus] = useState("public");
    const [statusOptions, setStatusOptions] = useState([]);
    const navigate = useNavigate();

    const fieldOptions = [
        { value: 'Art', label: 'Art' },
        { value: 'Business', label: 'Business' },
        { value: 'Computers', label: 'Computers' },
        { value: 'Education', label: 'Education' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Law', label: 'Law' },
        { value: 'Literature', label: 'Literature' },
        { value: 'Medicine', label: 'Medicine' },
        { value: 'Science', label: 'Science' },
        { value: 'Social Sciences', label: 'Social Sciences' },
        { value: 'Technology', label: 'Technology' },
    ];

    const statusOptionsList = [
        { value: 'Public', label: 'Public'  },
        { value: 'Private', label: 'Private' },
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
            setField("Art");
            setStatus("Public");

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

    const { TextArea } = Input;
    
    return (
        <BaseLayout>
            <h2>Create Quiz</h2>
            <form onSubmit={createQuiz}>
                <label htmlFor="title">Title:</label>
                <br />
                <Input className="form-input" showCount maxLength={50} onChange={(e) => setTitle(e.target.value)} />   
                <br />
                <label htmlFor="description">Description:</label>
                <br />
                <TextArea className="form-input" showCount maxLength={200} onChange={(e) => setDescription(e.target.value)}
                    style={{
                        height: 120,
                        resize: 'none',
                    }}
                />
                <br />
                <Space direction="vertical" style={{ marginTop: 20, width: '100%'}}>
                    <label htmlFor="field">Field:</label>
                    <Select
                        defaultValue="Art"
                        onChange={(value) => setField(value)}
                        style={{ width: '100%' }}
                        options={fieldOptions}
                    />
                    <label htmlFor="status">Status:</label>
                    <Select
                        defaultValue="Public"
                        onChange={(value) => setStatus(value)}
                        style={{ width: '100%' }}
                        options={statusOptionsList}
                    />
                </Space>
                <br />
                <Space>
                    
                </Space>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </BaseLayout>
    );
}

export default CreateQuiz;
