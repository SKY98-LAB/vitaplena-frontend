import { useState } from 'react';
import api from '../services/api';

const MENSAJE_ENVIADO =
  'Si el correo está registrado en VitaPlena, recibirás un enlace para recuperar tu contraseña.';
const MENSAJE_ENLACE_INVALIDO =
  'El enlace no es válido, ha expirado o ya fue utilizado. Solicita un nuevo enlace de recuperación.';

function RecuperarContrasena() {
  // El token se lee SOLO desde la URL y se mantiene únicamente en estado
  // de React (nunca se guarda, ni se muestra, ni se registra en logs).
  const [token] = useState(() => {
    const valor = new URLSearchParams(window.location.search).get('token');
    return valor && valor.trim() ? valor.trim() : '';
  });
  const [email, setEmail] = useState('');
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [error, setError] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [passwordCambiada, setPasswordCambiada] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/usuarios/recuperar', { email });
    } catch {
      setError(
        'No se pudo procesar la solicitud. Inténtalo de nuevo más tarde.'
      );
      setCargando(false);
      return;
    }
    setCargando(false);
    setSolicitudEnviada(true);
  };

  const handleCambiar = async (e) => {
    e.preventDefault();
    setError('');
    if (nuevaPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    try {
      // El token viaja en el BODY, nunca en la URL de la petición.
      await api.post('/usuarios/recuperar/confirmar', {
        token,
        nueva_password: nuevaPassword
      });
      setPasswordCambiada(true);
      // Limpiar el token de la URL sin react-router.
      window.history.replaceState(null, '', '/recuperar-contrasena');
    } catch (err) {
      const esEnlaceInvalido = err.response?.status === 400;
      setError(
        esEnlaceInvalido
          ? MENSAJE_ENLACE_INVALIDO
          : 'No se pudo cambiar la contraseña. Inténtalo de nuevo más tarde.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h3>🏃 VitaPlena</h3>
        <a
          href="/"
          style={{ color: 'white', textDecoration: 'none', fontSize: 14 }}
        >
          Volver al inicio
        </a>
      </div>

      <div className="container">
        <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
          {token ? (
            passwordCambiada ? (
              <div style={{ textAlign: 'center' }}>
                <h2>Contraseña actualizada</h2>
                <p style={{ color: '#2e7d32', fontSize: 16 }}>
                  Tu contraseña se actualizó correctamente.
                </p>
                <a
                  href="/"
                  className="btn btn-success"
                  style={{ display: 'inline-block', marginTop: 8 }}
                >
                  Iniciar sesión
                </a>
              </div>
            ) : (
              <div>
                <h2>Crear nueva contraseña</h2>
                <p>
                  Elige una nueva contraseña para tu cuenta de VitaPlena.
                </p>
                <form onSubmit={handleCambiar}>
                  <input
                    type="password"
                    className="input"
                    placeholder="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <input
                    type="password"
                    className="input"
                    placeholder="Confirmar contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 8 }}
                    disabled={cargando}
                  >
                    {cargando ? 'Procesando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>
            )
          ) : solicitudEnviada ? (
            <div style={{ textAlign: 'center' }}>
              <h2>Revisa tu correo</h2>
              <p>{MENSAJE_ENVIADO}</p>
              <a
                href="/"
                className="btn btn-primary"
                style={{ display: 'inline-block', marginTop: 8 }}
              >
                Volver a iniciar sesión
              </a>
            </div>
          ) : (
            <div>
              <h2>Recuperar contraseña</h2>
              <p>
                Ingresa el correo de tu cuenta de VitaPlena. Te enviaremos un
                enlace para restablecer tu contraseña.
              </p>
              <form onSubmit={handleSolicitar}>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: 8 }}
                  disabled={cargando}
                >
                  {cargando
                    ? 'Enviando...'
                    : 'Enviar enlace de recuperación'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 16 }}>
                <a
                  href="/"
                  style={{ color: '#2196F3', textDecoration: 'none' }}
                >
                  Volver a iniciar sesión
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecuperarContrasena;
