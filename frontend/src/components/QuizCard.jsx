import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { Link } from "react-router-dom";

const { Meta } = Card;

function QuizCard({quiz}) {
    const formattedDate = new Date(quiz.created_at).toDateString(); 

    return (
        
        <Card
            style={{ width: 300 }}
            
            actions={[
                <SettingOutlined key="setting" />,
                <Link to={`/create-flashcards/${quiz.id}/`}><EditOutlined key="edit" /></Link>,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >

            <Link to={`/quiz/${quiz.id}`}>
            <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={quiz.title}
                description={quiz.description}
            />
            <p>Author: {quiz.author_username}</p>
            <p>Quiz created at: {formattedDate}</p>
            <p>Field: {quiz.field}</p>
            <p>Status: {quiz.status}</p>
            </Link>
        </Card>
        
    )

}

export default QuizCard;