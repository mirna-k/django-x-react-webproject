import React from 'react';
import { Card, Space, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import '../styles/Home.css';

const { Meta } = Card;

function QuizCard({quiz}) {
    const formattedDate = new Date(quiz.created_at).toDateString(); 

    return (
        <Space direction="vertical" size={16} >
            <Card
                className='quiz-card'
                title={quiz.title}
                extra={<Link to={`/quiz/${quiz.id}`}><Button type="primary" shape="circle" icon={<RightOutlined />} /></Link>}
                style={{
                width: 300,
                marginBottom: 50,
                }}
            >
                <p>Author: <strong>{quiz.author_username}</strong></p>
            </Card>
        </Space>
    );

}

export default QuizCard;