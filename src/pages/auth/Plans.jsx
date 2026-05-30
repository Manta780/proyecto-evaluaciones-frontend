import { useNavigate } from 'react-router-dom';
import './Plans.css';

function Plans() {
  const navigate = useNavigate();

  return (
    <div className="plans-container">
      <div className="plans-header">
        <div className="plans-logo" onClick={() => navigate('/')}>QuizAI</div>
        <p className="plans-subtitle">Elige el plan que mejor se adapte a ti</p>
      </div>

      <div className="plans-grid">

        {/* Plan Gratis */}
        <div className="plan-card">
          <div className="plan-badge-free">Gratis</div>
          <div className="plan-price">
            <span className="plan-price-symbol">$</span>
            <span className="plan-price-amount">0</span>
            <span className="plan-price-period">/ mes</span>
          </div>
          <p className="plan-tagline">Perfecto para empezar</p>

          <button
            className="plan-btn-outline"
            onClick={() => navigate('/register?plan=free')}
          >
            Comenzar gratis
          </button>

          <ul className="plan-features">
            <li><span className="check">✓</span> Hasta <strong>5 quices creados por día</strong></li>
            <li><span className="check">✓</span> Máximo <strong>10 quices guardados</strong></li>
            <li><span className="check">✓</span> Generación con IA</li>
            <li><span className="check">✓</span> Exportar resultados básicos</li>
            <li><span className="cross">✗</span> Quices ilimitados</li>
            <li><span className="cross">✗</span> Analíticas avanzadas</li>
          </ul>
        </div>

        {/* Plan Premium */}
        <div className="plan-card plan-card-premium">
          <div className="plan-badge-premium">Premium</div>
          <div className="plan-price">
            <span className="plan-price-symbol">$</span>
            <span className="plan-price-amount">29.900</span>
            <span className="plan-price-period">COP / mes</span>
          </div>
          <p className="plan-tagline">Para docentes exigentes</p>

          <button
            className="plan-btn-primary"
            onClick={() => navigate('/register?plan=premium')}
          >
            Comenzar Premium
          </button>

          <ul className="plan-features">
            <li><span className="check">✓</span> <strong>Creación ilimitada</strong> de quices por día</li>
            <li><span className="check">✓</span> Máximo <strong>20 quices guardados</strong></li>
            <li><span className="check">✓</span> Generación con IA avanzada</li>
            <li><span className="check">✓</span> Analíticas detalladas</li>
            <li><span className="check">✓</span> Soporte prioritario</li>
            <li><span className="check">✓</span> Acceso anticipado a nuevas funciones</li>
          </ul>
        </div>

      </div>

      <p className="plans-note">
        Puedes cambiar o cancelar tu plan en cualquier momento.
      </p>
    </div>
  );
}

export default Plans;