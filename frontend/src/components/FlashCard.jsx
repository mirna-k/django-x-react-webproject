import React, { useState } from 'react';
import { Card, Row, Space } from 'antd';
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
                    <Card style={{ width: 400, height: 200, backgroundColor: '#f0f2f5' }}>
                        <p className='flashcard-text'>{flashcard.term}</p>
                    </Card>
                </div>
                <div className="flashcard-back">
                    <Card style={{ width: 400, height: 200, backgroundColor: '#bae7ff' }}>
                        <p className='flashcard-text'>{flashcard.description}</p>
                    </Card>
                </div>
            </div>
        </Row>
    );
}

export default FlashCard;
