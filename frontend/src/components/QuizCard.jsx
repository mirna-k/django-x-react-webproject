import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Space } from 'antd';
import { Link } from "react-router-dom";

const { Meta } = Card;

function QuizCard({quiz}) {
    const formattedDate = new Date(quiz.created_at).toDateString(); 

    return (
        <Space direction="vertical" size={16}>
            <Card
                title={quiz.title}
                extra={<Link to={`/quiz/${quiz.id}`}>More</Link>}
                style={{
                width: 300,
                }}
            >
                <p>Author: {quiz.author_username}</p>
            </Card>
        </Space>
    );

}

export default QuizCard;