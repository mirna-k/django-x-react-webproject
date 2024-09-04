import React, { useState } from 'react';
import { Card, Row, Space, Pagination } from 'antd';
import '../styles/FlashCard.css';

function FlashCard({ flashcard }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <Row 
            className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleCardClick}
        >
            <div className="flashcard" style={{margin: 20}}>
                <div className="flashcard-front">
                    <Card style={{ width: 600, height: 300, backgroundColor: '#f0f2f5' }}>
                        <p className='flashcard-text-front'>{flashcard.term}</p>
                    </Card>
                </div>
                <div className="flashcard-back">
                    <Card style={{ width: 600, height: 300, backgroundColor: '#bae7ff' }}>
                        <p className='flashcard-text-back'>{flashcard.description}</p>
                    </Card>
                </div>
            </div>
        </Row>
    );
}

export default FlashCard;
