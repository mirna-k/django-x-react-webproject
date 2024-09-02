import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { getAccessToken, refreshToken} from '../services/AuthService';

function LikeButton({ quizId, onLikeStatusChange }) {
    const [liked, setLiked] = useState(null);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            let accessToken = getAccessToken();
            try {
                const response = await axios.get(`/api/quiz/${quizId}/like-status/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setLiked(response.data.liked);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const newToken = await refreshToken();
                    if (newToken) {
                        try {
                            const response = await axios.get(`/api/quiz/${quizId}/like-status/`, {}, {
                                headers: { Authorization: `Bearer ${newToken}` }
                            });
                            setLiked(response.data.liked);
                        } catch (retryError) {
                            console.error('Error getting like status after token refresh:', retryError);
                        }
                    } else {
                        console.error('Unable to refresh token');
                    }
                }
            }
        };

        fetchLikeStatus();
    }, [quizId]);

    const toggleLike = async () => {
        let accessToken = getAccessToken();
        const newLikedStatus = !liked;

        try {
            const response = await axios.patch(`/api/quiz/${quizId}/like/`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setLiked(response.data.liked);
            onLikeStatusChange(newLikedStatus);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        const response = await axios.patch(`/api/quiz/${quizId}/like/`, {}, {
                            headers: { Authorization: `Bearer ${newToken}` }
                        });
                        setLiked(response.data.liked);
                        onLikeStatusChange(newLikedStatus);
                    } catch (retryError) {
                        console.error('Error toggling like after token refresh:', retryError);
                    }
                } else {
                    console.error('Unable to refresh token');
                }
            } else {
                console.error('Error toggling like:', error);
                setLiked(!newLikedStatus);
            }
        }
    };

    return (
        <Button 
            type="primary" 
            shape="circle" 
            danger
            onClick={toggleLike} 
            icon={liked ? <HeartFilled /> : <HeartOutlined />}
            style={{ marginTop: 30, marginLeft: 10 }}
        />
    );
}

export default LikeButton;
