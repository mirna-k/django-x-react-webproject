import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, theme, Button } from 'antd';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import axios from 'axios';
import GradientButton from './GradientButton';
import useIsMobile from '../services/ResponsiveService';
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

const BaseLayout = ({children}) => {
	const isMobile = useIsMobile(1000); 

	const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  
	const user = useUser();

	const headerItems = [
		getItem(<Link to="/">Home</Link>, '1', <HomeOutlined />),
		getItem(<Link to="/my-quizzes">My Quizzes</Link>, '2', <ProductOutlined />),
		getItem(<GradientButton />),
		user ? getItem(<span>{user.username}</span>, 'user') : getItem(<Link to="/login">Login</Link>),
		!user && getItem(<Link to="/register/">Register</Link>),
		user && getItem(<Link to="/logout">Logout</Link>),
	];

	return (
		<Layout>
			<Header
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className="demo-logo"><img src="../images/flash-card.png" style={{width: 40, height: 40, marginTop: 30}} alt="Logo"/></div>
				{isMobile ? (
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={['1']}
						items={headerItems}
						style={{
							flex: 1,
							minWidth: 0,
						}}
					/>
				) : (<>
				<div className="header-left">
					<Link to="/" className="header-item">
	
						<Button type="text" icon={<HomeOutlined />} style={{color: 'white'}}>Home</Button>
					</Link>
					<Link to="/my-quizzes" className="header-item">
					<Button type="link" icon={<ProductOutlined />} style={{color: 'white'}}>My Quizzes</Button>
					</Link>
				</div>
				<div className="header-right">
				<GradientButton className="header-item" />
					{!user && (
						<>
							<Link to="/login" className="header-item">Login</Link>
							<Link to="/register" className="header-item">Register</Link>
						</>
					)}
					{user && (
						<>
							<span className="header-item">{user.username}</span>
							<Link to="/logout" className="header-item">Logout</Link>
						</>
					)}
				</div>
				</>
				)}
			</Header>
			<Layout>
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
	);
};

export default BaseLayout;
