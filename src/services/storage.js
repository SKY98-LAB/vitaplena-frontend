const storage = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },

  getToken() {
    return localStorage.getItem('token');
  },
  setToken(token) {
    localStorage.setItem('token', token);
  },
  removeToken() {
    localStorage.removeItem('token');
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },
  setRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
  },
  removeRefreshToken() {
    localStorage.removeItem('refreshToken');
  },

  getUsuario() {
    return localStorage.getItem('usuario');
  },
  setUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },
  removeUsuario() {
    localStorage.removeItem('usuario');
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
  },
};

export default storage;
