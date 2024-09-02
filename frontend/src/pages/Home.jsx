import { useState, useEffect } from "react";
import api from "../api";
import { Space, Divider } from 'antd';
import { capitalize } from "../constants";
import GradientButton from "../components/GradientButton";
import BaseLayout from "../components/BaseLayout";
import QuizCard from "../components/QuizCard";
import "../styles/Home.css"

function Home() {
    const [public_quizes, setPublicQuizes] = useState([]);

    useEffect(() => {
        getPublicQuizes();
    }, []);

    const getPublicQuizes = () => {
        api.get("/api/public-quizzes/")
            .then((res) => res.data)
            .then((data) => {
                setPublicQuizes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const quizzesByField = public_quizes.reduce((acc, quiz) => {
        const { field } = quiz;
        if (!acc[field]) {
            acc[field] = [];
        }
        acc[field].push(quiz);
        return acc;
    }, {});


    return (
        <BaseLayout>
            <div>
                <GradientButton />
                <h2>Browse Quizzes</h2>
            </div>
            {Object.entries(quizzesByField).map(([field, quizzes]) => (
                <div key={field}>
                    <Divider orientation="left" style={{fontSize: '20x', fontWeight: 'bold', color: '#1677FF'}}>{capitalize(field)}</Divider>
                    <Space size={[4, 4]} wrap>
                        {quizzes.map((quiz) => (
                            <QuizCard 
                                quiz={quiz} 
                                key={quiz.id} 
                            />
                        ))}
                    </Space>
                </div>
            ))}
        </BaseLayout>
    );
}

export default Home;
