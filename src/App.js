import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuizDetail from './pages/teacher/QuizDetail';
import CreateQuiz from './pages/teacher/CreateQuiz';
import QuizDashboard from './pages/teacher/QuizDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Plans from './pages/auth/Plans';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<Plans />} />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="Docente">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quiz/:id"
          element={
            <ProtectedRoute requiredRole="Docente">
              <QuizDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quiz/:id/dashboard"
          element={
            <ProtectedRoute requiredRole="Docente">
              <QuizDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create"
          element={
            <ProtectedRoute requiredRole="Docente">
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;