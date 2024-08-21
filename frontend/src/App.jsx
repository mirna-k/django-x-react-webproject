import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from "./components/ProtectedRoute";
import QuizDetail from './components/QuizDetail';
import CreateQuiz from './pages/CreateQuiz';
import CreateFlashcards from './pages/CreateFlashcards';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz/:id" element={<QuizDetail />} />
        <Route path="/create-flashcards/:quizId" element={<CreateFlashcards />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
