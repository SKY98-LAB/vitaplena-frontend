const listeners = new Set();

export function emitLogout() {
  listeners.forEach((listener) => listener());
}

export function subscribeLogout(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
