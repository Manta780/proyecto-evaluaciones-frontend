import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuizDetail from './pages/teacher/QuizDetail';
import CreateQuiz from './pages/teacher/CreateQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/quiz/:id" element={<QuizDetail />} />
        <Route path="/teacher/create" element={<CreateQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;