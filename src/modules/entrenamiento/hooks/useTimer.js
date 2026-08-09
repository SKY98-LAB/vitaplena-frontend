import { useCallback, useEffect, useRef, useState } from 'react';

function useTimer() {
  const [tiempo, setTiempo] = useState(0);
  const [descanso, setDescanso] = useState(60);
  const [corriendo, setCorriendo] = useState(false);
  const timerRef = useRef(null);

  const detener = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setCorriendo(false);
  }, []);

  const iniciarConteo = useCallback((setValor, inicial, onAlerta, onCompletar) => {
    detener();
    setValor(inicial);
    setCorriendo(true);
    timerRef.current = setInterval(() => {
      setValor((prev) => {
        if (prev === 4) onAlerta();
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setCorriendo(false);
          onCompletar();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [detener]);

  const contarTiempo = useCallback((inicial, onAlerta, onCompletar) => {
    iniciarConteo(setTiempo, inicial, onAlerta, onCompletar);
  }, [iniciarConteo]);

  const contarDescanso = useCallback((inicial, onAlerta, onCompletar) => {
    iniciarConteo(setDescanso, inicial, onAlerta, onCompletar);
  }, [iniciarConteo]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return { tiempo, descanso, corriendo, contarTiempo, contarDescanso, detener };
}

export default useTimer;
