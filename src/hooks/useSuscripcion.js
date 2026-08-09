import { useEffect, useState } from 'react';
import api from '../services/api';
import { PLANES_PREMIUM } from '../constants/planes';

function useSuscripcion() {
  const [suscripcion, setSuscripcion] = useState(null);
  const [codigo_plan, setCodigoPlan] = useState(null);
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    api
      .get('/usuarios/suscripcion')
      .then((res) => {
        if (!activo) return;
        const data = res.data || {};
        setSuscripcion(data.suscripcion || null);
        setCodigoPlan(data.suscripcion?.codigo_plan || null);
        setPermisos(data.permisos || {});
      })
      .catch((err) => {
        if (activo) setError(err);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const esPremium = permisos?.rutinas_ilimitadas === true || PLANES_PREMIUM.includes(codigo_plan);

  return { suscripcion, codigo_plan, permisos, esPremium, loading, error };
}

export default useSuscripcion;
