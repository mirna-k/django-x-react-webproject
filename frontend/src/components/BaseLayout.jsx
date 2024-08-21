import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BaseLayout.css';

const BaseLayout = ({ children }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link className="custom-link" to="/">Home</Link></li>
                        <li><Link className="custom-link" to="/my-quizes">My Quizes</Link></li>
                        <li><Link className="custom-link" to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </header>

            <aside>
                <ul>
                    <li><Link className="custom-link" to="/profile">Profile</Link></li>
                    <li><Link className="custom-link" to="/settings">Settings</Link></li>
                </ul>
            </aside>

            <main>
                {children}
            </main>

            <footer>
                <p>&copy; 2024 My App</p>
            </footer>
        </div>
    );
};

export default BaseLayout;
