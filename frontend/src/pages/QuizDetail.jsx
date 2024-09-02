import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from '../components/BaseLayout';
import FlashCard from '../components/FlashCard';
import LikeButton from '../components/LikeButton';
import { capitalize } from '../constants';
import { getAccessToken, refreshToken, fetchUser } from '../services/AuthService';
import { Button, Progress, Space, Row, Divider, Col, Statistic} from 'antd';
import { LikeOutlined, PlusCircleOutlined } from '@ant-design/icons';

function QuizDetail() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [results, setResults] = useState([]);
    const [user, setUser] = useState(null);
    const [liked, setLiked] = useState(null);
    const [totalLikes, setTotalLikes] = useState(0);
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

                const likesResponse = await axios.get(`/api/quiz/${id}/like-status/`)
                setLiked(likesResponse.data.liked);
                setTotalLikes(likesResponse.data.total_likes);
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
                    <Col className="gutter-row" span={12}>
                        <p>Author: {quiz.author_username}</p>
                        <p>Quiz created: {formattedDate}</p>
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
                
                <p style={{fontSize: '20px'}}>{quiz.description}</p>
                <p>Field: {capitalize(quiz.field)}</p>
                <p>Status: {capitalize(quiz.status)}</p>


                <Link to={`/quiz/${quiz.id}/take`}>
                    <Button type="primary">Take Quiz</Button>
                </Link>
            </div>
            <Divider orientation="left" style={{fontSize: '30px'}}>Flashcards</Divider>
            <Row>
                <Col className="gutter-row" span={12}>
                    <ul>
                        {flashcards.map((flashcard) => (
                            <FlashCard 
                                flashcard={flashcard} 
                                key={flashcard.id} 
                            />
                        ))}
                    </ul>
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
            
            <div>
                <Divider orientation="left" style={{fontSize: '30px'}}>Quiz Results</Divider>
                {results.length > 0 ? (
                    <ul>
                    {results.map(result => (
                        <Space key={result.id}  size="middle" style={{paddingBottom: 20}}>
                            <p> <strong>{result.taker_username}</strong> </p>
                            <Progress
                                percent={result.score}
                                percentPosition={{
                                    align: 'start',
                                    type: 'inner',
                                }}
                                size={[500, 20]}
                                strokeColor={conicColors}
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
