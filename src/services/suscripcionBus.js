const listeners = new Set();

export function emitRefrescoSuscripcion() {
  listeners.forEach((listener) => listener());
}

export function subscribeRefrescoSuscripcion(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
