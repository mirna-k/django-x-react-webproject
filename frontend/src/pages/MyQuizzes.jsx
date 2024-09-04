import { useState, useEffect } from "react";
import api from "../api";
import axios from 'axios';
import BaseLayout from "../components/BaseLayout";
import QuizCard from "../components/QuizCard";
import { Divider, Space, Anchor, Col, Row } from 'antd';
import { getAccessToken, refreshToken } from '../services/AuthService';
import useIsMobile from "../services/ResponsiveService";
import "../styles/Home.css"

function MyQuizzes() {
    const [my_quizzes, setMyQuizzes] = useState([]);
    const [likedQuizzes, setLikedQuizzes] = useState([]);
    const isMobile = useIsMobile(1000); 

    useEffect(() => {
        getMyQuizzes();
        getLikedQuizzes();

    }, []);

    const getLikedQuizzes = async () => {
        let accessToken = getAccessToken();
        try {
            console.log("Fetching liked quizzes...");
            const response = await axios.get('/api/liked-quizzes/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setLikedQuizzes(response.data);
            console.log("Liked quizzes data:", response.data);
        } catch (error) {
            console.error('Error fetching liked quizzes:', error);
            if (error.response && error.response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        const response = await axios.get('/api/liked-quizzes/', {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        });
                        setLikedQuizzes(response.data);
                        console.log("Liked quizzes data after token refresh:", response.data);
                    } catch (retryError) {
                        console.error('Error fetching liked quizzes after token refresh:', retryError);
                    }
                } else {
                    console.error('Unable to refresh token');
                }
            }
        }
    };

    const getMyQuizzes = () => {
        api.get("/api/my-quizzes/")
            .then((res) => res.data)
            .then((data) => {
                setMyQuizzes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    return (
        <BaseLayout>
            <Row>
            {isMobile ? (
                <Col span={20}>
                    <Anchor direction="horizontal"
                        items={[
                            {
                                key: 'my-quizzes',
                                href: '#my-quizzes',
                                title: 'My Quizzes',
                            },
                            {
                                key: 'liked-quizzes',
                                href: '#liked-quizzes',
                                title: 'Liked Quizzes',
                            },
                        ]}
                    />
                </Col>
            ) : (
                <Col span={4}>
                    <Anchor
                        items={[
                            {
                                key: 'my-quizzes',
                                href: '#my-quizzes',
                                title: 'My Quizzes',
                            },
                            {
                                key: 'liked-quizzes',
                                href: '#liked-quizzes',
                                title: 'Liked Quizzes',
                            },
                        ]}
                    />
                </Col>
                    )}
                
                <Col span={20}>
                    <div id="my-quizzes">
                        <Divider orientation="left" style={{fontSize: '30px'}}>My Quizzes</Divider>
                        {my_quizzes.length > 0 ? (
                        <Space className="quiz-list" size={[4, 4]} wrap>
                            {my_quizzes.map((quiz) => (
                                <QuizCard 
                                    quiz={quiz} 
                                    key={quiz.id} 
                                />
                            ))}
                        </Space>
                        ) : (
                            <p>You don't have any quizzes yet.</p>
                        )}
                    </div>
                    <div id="liked-quizzes">
                        <Divider orientation="left" style={{fontSize: '30px', marginTop: '70px'}}>Liked Quizzes</Divider>
                        {likedQuizzes.length > 0 ? (
                        <ul className="quiz-list">
                            {likedQuizzes.map((quiz) => (
                                <QuizCard 
                                    quiz={quiz} 
                                    key={quiz.id} 
                                />
                            ))}
                        </ul>
                        ) : (
                            <p>You haven't liked any quizzes yet.</p>
                        )}
                    </div>
                </Col>
            </Row>
        </BaseLayout>
    );
}

export default MyQuizzes;
