import { useState, useEffect } from "react";
import api from "../api";
import axios from 'axios';
import GradientButton from "../components/GradientButton";
import BaseLayout from "../components/BaseLayout";
import QuizCard from "../components/QuizCard";
import { Divider } from 'antd';
import { getAccessToken, refreshToken } from '../services/AuthService';
import "../styles/Home.css"

function MyQuizzes() {
    const [my_quizzes, setMyQuizzes] = useState([]);
    const [likedQuizzes, setLikedQuizzes] = useState([]);

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
            <div>
                <GradientButton />
            </div>
            <div>
                <Divider orientation="left" style={{fontSize: '30px'}}>My Quizzes</Divider>
                {my_quizzes.length > 0 ? (
                <ul className="quiz-list">
                    {my_quizzes.map((quiz) => (
                        <QuizCard 
                            quiz={quiz} 
                            key={quiz.id} 
                        />
                    ))}
                </ul>
                ) : (
                    <p>You don't have any quizzes yet.</p>
                )}
            </div>
            <div>
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
        </BaseLayout>
    );
}

export default MyQuizzes;
