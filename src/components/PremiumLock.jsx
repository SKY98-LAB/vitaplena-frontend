import useSuscripcion from '../hooks/useSuscripcion';

function PremiumLock({ children, fallback }) {
  const { esPremium, loading } = useSuscripcion();

  if (loading) return null;
  if (esPremium) return children;
  return fallback || (
    <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>
      🔒 Contenido PREMIUM
    </div>
  );
}

export default PremiumLock;
