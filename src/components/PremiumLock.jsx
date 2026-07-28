import { useState, useEffect } from 'react';
import api from '../services/api';

function PremiumLock({ children, fallback }) {
  const [esPremium, setEsPremium] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/usuarios/suscripcion').then(res => {
      setEsPremium(res.data.suscripcion?.estado === 'activo');
      setCargando(false);
    });
  }, []);

  if (cargando) return null;
  if (esPremium) return children;
  return fallback || (
    <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>
      🔒 Contenido PREMIUM
    </div>
  );
}

export default PremiumLock;