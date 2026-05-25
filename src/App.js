import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuizDetail from './pages/teacher/QuizDetail';
import CreateQuiz from './pages/teacher/CreateQuiz';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          path="/teacher/create"
          element={
            <ProtectedRoute requiredRole="Docente">
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <div>Student Dashboard (en construcción)</div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;