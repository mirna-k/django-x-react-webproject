import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { DesktopOutlined, FileOutlined, TeamOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import axios from 'axios';
import '../styles/BaseLayout.css';

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return user;
};

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
    getItem(<Link to="/">Home</Link>, '1', <HomeOutlined />),
    getItem(<Link to="/my-quizzes">My Quizzes</Link>, '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Tom', '3'),
      getItem('Bill', '4'),
      getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
  ];

const BaseLayout = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  
  const user = useUser();

  const headerItems = [
    user ? getItem(<span>{user.username}</span>, 'user') : getItem(<Link to="/login">Login</Link>),
    !user && getItem(<Link to="/register/">Register</Link>),
    user && getItem(<Link to="/logout">Logout</Link>),
  ];

  return (
    <Layout style={{ height: 100}}>
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
            }}>
            <div className="demo-logo"><img src="../images/flash-card.png" style={{width: 40, height: 40, marginTop: 30}} alt="Logo"/></div>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={headerItems}
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            />
        </Header>
        <Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout
                style={{
                    padding: '0 24px 24px',
                }}
            >
                <Content
                    style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    minHeight: 'calc(100vh - 64px - 70px)',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    </Layout>
  );
};

export default BaseLayout;
