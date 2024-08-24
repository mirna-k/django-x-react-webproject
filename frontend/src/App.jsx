import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from "./components/ProtectedRoute";
import QuizDetail from './pages/QuizDetail';
import CreateQuiz from './pages/CreateQuiz';
import CreateFlashcards from './pages/CreateFlashcards';
import TakeQuiz from './pages/TakeQuiz';

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
        <Route path="/create-quiz" element={<ProtectedRoute> <CreateQuiz /> </ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute> <QuizDetail /> </ProtectedRoute>} />
        <Route path="/create-flashcards/:quizId" element={<ProtectedRoute> <CreateFlashcards /> </ProtectedRoute>} />
        <Route path="/quiz/:quizId/take" element={<ProtectedRoute> <TakeQuiz /> </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
