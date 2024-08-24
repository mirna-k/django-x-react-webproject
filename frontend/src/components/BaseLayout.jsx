import React, { useState } from 'react';
import {
      DesktopOutlined,
      FileOutlined,
      TeamOutlined,
      UserOutlined,
      HomeOutlined
    } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Sider, Footer } = Layout;

const headerItems = [
    getItem(<Link to="/register/">Register</Link>),
    getItem(<Link to="/login">Login</Link>),
    getItem(<Link to="/logout">Logout</Link>),
    'user']

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
    getItem(<Link to="/">My Quizzes</Link>, '2', <DesktopOutlined />),
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

    return (
    <Layout>
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="demo-logo" />
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
