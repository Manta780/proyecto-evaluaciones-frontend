import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f1117',
        color: '#7c6af7'
      }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    console.log('✗ Acceso denegado: usuario no autenticado');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log(`✗ Acceso denegado: rol requerido ${requiredRole}, usuario tiene ${user.role}`);
    return <Navigate to="/" replace />;
  }

  console.log('✓ Acceso permitido:', user.email, '- Rol:', user.role);
  return children;
}

export default ProtectedRoute;