import React, { useState } from 'react';
import { Card } from 'antd';
import '../styles/FlashCard.css';

function FlashCard({ flashcard }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div 
            className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleCardClick}
        >
            <div className="flashcard">
                <div className="flashcard-front">
                    <Card style={{ width: 300, backgroundColor: '#f0f2f5' }}>
                        <p>{flashcard.term}</p>
                    </Card>
                </div>
                <div className="flashcard-back">
                    <Card style={{ width: 300, backgroundColor: '#bae7ff' }}>
                        <p>{flashcard.description}</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default FlashCard;
