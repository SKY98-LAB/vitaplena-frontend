import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ENDPOINTS_RESUMEN = {
  comidas: '/alimentacion/comidas',
  corporal: '/registros/corporal/resumen',
  sueno: '/bienestar/sueno/resumen',
  hidratacion: '/bienestar/hidratacion'
};

const SECCIONES_DEFAULT = ['comidas', 'corporal', 'sueno', 'hidratacion'];

function useResumenHoy(secciones = SECCIONES_DEFAULT) {
  const clave = secciones.join(',');
  const [datos, setDatos] = useState(null);

  const cargar = useCallback(async () => {
    const activas = clave.split(',');
    try {
      const respuestas = await Promise.all(activas.map((s) => api.get(ENDPOINTS_RESUMEN[s])));
      setDatos(Object.fromEntries(activas.map((s, i) => [s, respuestas[i].data])));
    } catch (err) {
      console.error('Error al cargar resumen');
    }
  }, [clave]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, recargar: cargar };
}

export default useResumenHoy;
