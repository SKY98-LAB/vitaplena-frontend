import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { subscribeRefrescoSuscripcion } from '../services/suscripcionBus';
import { PLANES_PREMIUM } from '../constants/planes';

function useSuscripcion() {
  const [suscripcion, setSuscripcion] = useState(null);
  const [codigo_plan, setCodigoPlan] = useState(null);
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(() => {
    return api
      .get('/usuarios/suscripcion')
      .then((res) => {
        const data = res.data || {};
        setSuscripcion(data.suscripcion || null);
        setCodigoPlan(data.suscripcion?.codigo_plan || null);
        setPermisos(data.permisos || {});
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let activo = true;
    cargar();

    const desuscribirse = subscribeRefrescoSuscripcion(() => {
      if (activo) cargar();
    });

    return () => {
      activo = false;
      desuscribirse();
    };
  }, [cargar]);

  const esPremium = permisos?.rutinas_ilimitadas === true || PLANES_PREMIUM.includes(codigo_plan);

  return { suscripcion, codigo_plan, permisos, esPremium, loading, error, refrescar: cargar };
}

export default useSuscripcion;
