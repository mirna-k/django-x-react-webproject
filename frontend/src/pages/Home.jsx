import { useState, useEffect, useContext } from "react";
import api from "../api";
import BaseLayout from "../components/BaseLayout";
import "../styles/Home.css"
import QuizCard from "../components/QuizCard";
import { Button, ConfigProvider, Space } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Link } from "react-router-dom";

function Home() {
    const [my_quizes, setMyQuizes] = useState([]);

    useEffect(() => {
        getMyQuizes();
    }, []);

    const getMyQuizes = () => {
        api.get("/api/my-quizes/")
            .then((res) => res.data)
            .then((data) => {
                setMyQuizes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const rootPrefixCls = getPrefixCls();
    const linearGradientButton = css`
        &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
            border-width: 0;

            > span {
                position: relative;
            }

            &::before {
                content: '';
                background: linear-gradient(135deg, #6253e1, #04befe);
                position: absolute;
                inset: 0;
                opacity: 1;
                transition: all 0.3s;
                border-radius: inherit;
            }

            &:hover::before {
                opacity: 0;
            }
        }`;

    return (
        <BaseLayout>
            <div>
            <ConfigProvider button={{className: linearGradientButton,}}>
                <Space>
                    <Link to="/create-quiz">
                    <Button type="primary" size="large" icon={<PlusCircleOutlined />}>
                        Create Quiz
                    </Button>
                    </Link>
                </Space>
            </ConfigProvider>
                <h2>Home</h2>
                <ul>
                    {my_quizes.map((quiz) => (
                        <QuizCard 
                            quiz={quiz} 
                            key={quiz.id} 
                        />
                    ))}
                </ul>
            </div>
        </BaseLayout>
    );
}

export default Home;
