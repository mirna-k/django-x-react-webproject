import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import FlashCard from '../components/FlashCard';
import LikeButton from '../components/LikeButton';
import { capitalize } from '../constants';
import { getAccessToken, refreshToken, fetchUser } from '../services/AuthService';
import useIsMobile from "../services/ResponsiveService";
import { Button, Progress, Space, Row, Divider, Col, Statistic, Pagination} from 'antd';
import { LikeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import '../styles/FlashCard.css';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [results, setResults] = useState([]);
    const [user, setUser] = useState(null);
    const [liked, setLiked] = useState(null);
    const [totalLikes, setTotalLikes] = useState(0);
    const [transitionClass, setTransitionClass] = useState('');

    const navigate = useNavigate(); 
    const isMobile = useIsMobile(1000); 

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

                const likesResponse = await axios.get(`/api/quiz/${id}/like-status/`)
                setLiked(likesResponse.data.liked);
                setTotalLikes(likesResponse.data.total_likes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const [currentPage, setCurrentPage] = useState(1);
    const flashcardsPerPage = 1;

    const indexOfCurrentFlashcard = (currentPage - 1) * flashcardsPerPage;
    const currentFlashcard = flashcards[indexOfCurrentFlashcard];

    const handlePageChange = (page) => {
        setTransitionClass('fade-out');
        setTimeout(() => {
            setCurrentPage(page);
            setTransitionClass('fade-in');
        }, 400);
    };

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

    const handleLikeStatusChange = (liked) => {
        setTotalLikes((totalLikes) => liked ? totalLikes + 1 : totalLikes - 1);
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
                <Row>
                    <Col className="gutter-row" span={12} style={{marginLeft: '40px'}}>
                        <p>{formattedDate}</p>
                        <p>Author: {quiz.author_username}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <Row>
                            <Statistic title="Likes" value={totalLikes} prefix={<LikeOutlined />} />
                            {!isAuthor && (
                               <LikeButton quizId={quiz.id} onLikeStatusChange={handleLikeStatusChange}/>
                            )}
                        </Row>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        {isAuthor && (
                            <>
                                <Button style={{float: 'right'}} onClick={() => deleteQuiz(quiz.id)} danger>Delete Quiz</Button>
                            </>
                        )}
                    </Col>
                </Row>
                <Divider orientation="left" style={{fontSize: '40px'}} >{quiz.title}</Divider>
                
                <div style={{marginLeft: '50px'}}>
                    <p style={{fontSize: '20px'}}>{quiz.description}</p>
                    <p>Field: {capitalize(quiz.field)}</p>
                    <p>Status: {capitalize(quiz.status)}</p>
                    <Link to={`/quiz/${quiz.id}/take`}>
                        <Button type="primary">Take Quiz</Button>
                    </Link>
                </div>
            </div>
            <Divider orientation="left" style={{fontSize: '30px'}}>Flashcards</Divider>
            {isMobile ? (
                <Row>
                    <Col className="gutter-row" span={24} style={{marginLeft: '10px'}}>
                        {flashcards.length > 0 && currentFlashcard ? (
                            <div className={`flashcard-wrapper ${transitionClass}`}>
                                <FlashCard flashcard={currentFlashcard} key={currentFlashcard.id} />
                            </div>
                        ) : (
                            <p style={{ padding: 20, fontSize: '20px' }}>No flashcards available.</p>
                        )}
        
                        {flashcards.length > 0 && (
                            <Pagination
                                current={currentPage}
                                total={flashcards.length}
                                pageSize={flashcardsPerPage}
                                onChange={handlePageChange}
                                style={{ marginTop: '16px', textAlign: 'center' }}
                            />
                        )}
                    </Col>
                    <Col className="gutter-row" span={24}>
                        {isAuthor && (
                            <>
                                <Link to={`/create-flashcards/${quiz.id}`}>
                                    <Button style={{float: 'right'}} type="primary" icon={<PlusCircleOutlined />}>Add Flashcards</Button>
                                </Link>
                            </>
                        )}
                    </Col>
                </Row>

            ) : (
                <Row>
            <Col className="gutter-row" span={12} style={{marginLeft: '50px'}}>
                {flashcards.length > 0 && currentFlashcard ? (
                    <div className={`flashcard-wrapper ${transitionClass}`}>
                        <FlashCard flashcard={currentFlashcard} key={currentFlashcard.id} />
                    </div>
                ) : (
                    <p style={{ padding: 20, fontSize: '20px' }}>No flashcards available.</p>
                )}
  
                {flashcards.length > 0 && (
                    <Pagination
                        current={currentPage}
                        total={flashcards.length}
                        pageSize={flashcardsPerPage}
                        onChange={handlePageChange}
                        style={{ marginTop: '16px', textAlign: 'center' }}
                    />
                )}
            </Col>
                <Col className="gutter-row" span={12}>
                    {isAuthor && (
                        <>
                            <Link to={`/create-flashcards/${quiz.id}`}>
                                <Button style={{float: 'right'}} type="primary" icon={<PlusCircleOutlined />}>Add Flashcards</Button>
                            </Link>
                        </>
                    )}
                </Col>
            </Row>
            ) }
            
            <Divider orientation="left" style={{fontSize: '30px'}}>Quiz Results</Divider>
            <div>
                {results.length > 0 ? (
                    <Space direction="vertical" size="middle" style={{ paddingBottom: 20, width: '100%' }}>
                        {results.map(result => (
                            <div key={result.id} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', width: '100%' }}>
                                <p><strong>{result.taker_username}</strong></p>
                                <Progress
                                    percent={result.score}
                                    size={[400, 20]}
                                    strokeColor={conicColors}
                                    style={{ width: '100%', maxWidth: '500px' }} 
                                />
                                <p>Date: {new Date(result.completed_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </Space>
                ) : (
                    <p style={{ padding: 20, fontSize: '20px' }}>No results yet.</p>
                )}
            </div>
        </BaseLayout>
    );
}

export default QuizDetail;
