import { useState, useEffect } from "react";
import api from "../api";
import { Space, Divider, Row, Col, Anchor } from 'antd';
import { capitalize } from "../constants";
import BaseLayout from "../components/BaseLayout";
import QuizCard from "../components/QuizCard";
import useIsMobile from "../services/ResponsiveService";
import "../styles/Home.css"

function Home() {
    const [public_quizes, setPublicQuizes] = useState([]);
    const isMobile = useIsMobile(1000); 

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

    const sortedQuizzesByField = Object.keys(quizzesByField)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedAcc, field) => {
        sortedAcc[field] = quizzesByField[field];
        return sortedAcc;
    }, {});

    return (
        <BaseLayout>
            <Space>
                <Row>
                    {isMobile ? (
                        <Col span={20}>
                            <Anchor direction="horizontal">
                            {Object.keys(sortedQuizzesByField).map((field) => (
                                <Anchor.Link 
                                    key={field} 
                                    href={`#${field}`} 
                                    title={capitalize(field)} 
                                />
                            ))}
                            </Anchor>
                        </Col>
                    ) : (
                        <Col span={4}>
                            <Anchor>
                                {Object.keys(sortedQuizzesByField).map((field) => (
                                    <Anchor.Link 
                                        key={field} 
                                        href={`#${field}`} 
                                        title={capitalize(field)} 
                                    />
                                ))}
                            </Anchor>
                        </Col>
                    )}
                    
                    <Col span={20}>
                        <div>
                            <h1>Browse Quizzes</h1>
                        </div>
                        {Object.entries(sortedQuizzesByField).map(([field, quizzes]) => (
                            <div key={field} id ={field}>
                                <Divider orientation="left" style={{ fontWeight: 'bold', color: '#004ab3'}}>{capitalize(field)}</Divider>
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
                    </Col>
                </Row>
            </Space>
        </BaseLayout>
    );
}

export default Home;
