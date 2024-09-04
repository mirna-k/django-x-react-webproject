import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import BaseLayout from '../components/BaseLayout';
import useIsMobile from "../services/ResponsiveService";
import { Space, Row, Input, Button, Divider, Col} from "antd";
import { MinusOutlined    , PlusCircleOutlined } from '@ant-design/icons';

function CreateFlashcards() {
    const { quizId } = useParams();
    const [flashcards, setFlashcards] = useState([{ quiz: quizId, term: '', description: '' }]);
    const [quiz, setQuiz] = useState(null);
    const isMobile = useIsMobile(1000); 

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

    const removeFlashcard = (index) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
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
            
                {isMobile ? (
                    <Row>
                        <Col span={24}>
                            {quiz ? <h1>{quiz.title}</h1> : <p>Loading quiz details...</p>}
                            <h2>Create Flashcards</h2>
                            <Button type='primary' danger>
                                <Link to={`/`}>Discard Changes</Link>
                            </Button>
                        </Col>
                        <Col span={24}>
                            <form onSubmit={handleSubmit}>
                                {flashcards.map((flashcard, index) => (
                                    <div key={index}>
                                        <Row>
                                            <Col span={12}>
                                                <h3>{index + 1}.</h3>
                                            </Col>
                                            <Col span={12}>
                                                <Button 
                                                    type="primary" 
                                                    danger
                                                    shape="circle" 
                                                    size='small'
                                                    onClick={() => removeFlashcard(index)}  
                                                    icon={<MinusOutlined />}
                                                    style={{ marginTop: 20, marginRight: 10, float: 'right'}}
                                                />
                                            </Col>
                                        </Row>
                                        <label>Term</label>
                                        <Input name="term" value={flashcard.term} onChange={(e) => handleFlashcardChange(index, e)} /> 
                                        <label>Description</label>
                                        <TextArea name="description" value={flashcard.description} showCount maxLength={200} onChange={(e) => handleFlashcardChange(index, e) }
                                            style={{
                                                height: 120,
                                                resize: 'none',
                                            }}
                                        />
                                        <Divider/>
                                    </div>
                                ))}
                                <Space direction="vertical" style={{ display: 'flex' }}>
                                    <Button 
                                        shape="circle" 
                                        onClick={addFlashcard} 
                                        size="large" 
                                        icon={<PlusCircleOutlined />}
                                    />
                                    <input type="submit" value="Create Flashcards" />
                                </Space>
                            </form>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col span={6}>
                            {quiz ? <h1>{quiz.title}</h1> : <p>Loading quiz details...</p>}
                            <h2>Create Flashcards</h2>
                            <Button type='primary' danger>
                                <Link to={`/`}>Discard Changes</Link>
                            </Button>
                        </Col>
                        <Col span={12}>
                            <form onSubmit={handleSubmit}>
                                {flashcards.map((flashcard, index) => (
                                    <div key={index}>
                                        <Row>
                                            <Col span={12}>
                                                <h3>{index + 1}.</h3>
                                            </Col>
                                            <Col span={12}>
                                                <Button 
                                                    type="primary" 
                                                    danger
                                                    shape="circle" 
                                                    size='small'
                                                    onClick={() => removeFlashcard(index)}  
                                                    icon={<MinusOutlined />}
                                                    style={{ marginTop: 20, marginRight: 10, float: 'right'}}
                                                />
                                            </Col>
                                        </Row>
                                        <label>Term</label>
                                        <Input name="term" value={flashcard.term} onChange={(e) => handleFlashcardChange(index, e)} /> 
                                        <label>Description</label>
                                        <TextArea name="description" value={flashcard.description} showCount maxLength={200} onChange={(e) => handleFlashcardChange(index, e) }
                                            style={{
                                                height: 120,
                                                resize: 'none',
                                            }}
                                        />
                                        <Divider/>
                                    </div>
                                ))}
                                <Space direction="vertical" style={{ display: 'flex' }}>
                                    <Button 
                                        shape="circle" 
                                        onClick={addFlashcard} 
                                        size="large" 
                                        icon={<PlusCircleOutlined />}
                                    />
                                    <input type="submit" value="Create Flashcards" />
                                </Space>
                            </form>
                        </Col>
                    </Row>
                )}
        </BaseLayout>
    );
}

export default CreateFlashcards;
