import { useState } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

function Ajustes() {
  const { usuario, logout } = useAuth();
  const esGoogle = Boolean(usuario?.es_google);

  const [password, setPassword] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [confirmarModal, setConfirmarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const solicitarEliminacion = (e) => {
    e.preventDefault();
    setEstado('');
    setMensaje('');
    setConfirmarModal(true);
  };

  const ejecutarEliminacion = async () => {
    setCargando(true);
    setEstado('');
    setMensaje('');
    try {
      await api.delete('/usuarios/cuenta', {
        data: { email: usuario.email, password }
      });
      setEstado('exito');
      setTimeout(() => logout(), 2500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        setMensaje(
          'Credenciales incorrectas. Verifica tu contraseña e inténtalo de nuevo.'
        );
      } else if (status === 401) {
        setMensaje('Tu sesión expiró. Inicia sesión nuevamente.');
        setTimeout(() => logout(), 2000);
      } else if (status === 403) {
        setMensaje('No tienes permisos para realizar esta acción.');
      } else if (status === 409) {
        setMensaje(
          'Tu cuenta usa Google. La eliminación con reautenticación de Google aún no está disponible.'
        );
      } else if (status === 429) {
        setMensaje('Demasiados intentos. Inténtalo más tarde.');
      } else {
        setMensaje(
          'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.'
        );
      }
      setEstado('error');
    } finally {
      setCargando(false);
      setConfirmarModal(false);
    }
  };

  if (estado === 'exito') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: 24 }}>
        <h2>✅ Cuenta eliminada</h2>
        <p style={{ color: '#2e7d32', fontSize: 16 }}>
          Tu cuenta y tus datos fueron eliminados correctamente.
        </p>
        <p>Te llevaremos a la pantalla de inicio de sesión...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>⚙️ Configuración</h2>

      <div className="card">
        <h3>👤 Mi cuenta</h3>
        <p style={{ marginBottom: 4 }}>
          <strong>Nombre:</strong> {usuario?.nombre}
        </p>
        <p>
          <strong>Correo:</strong> {usuario?.email}
        </p>
        {esGoogle && (
          <span className="badge badge-blue">Cuenta vinculada con Google</span>
        )}
      </div>

      <div className="card">
        <h3>🗑️ Eliminar mi cuenta</h3>

        {esGoogle ? (
          <div>
            <p>
              Tu cuenta está vinculada con <strong>Google</strong>. La
              eliminación de cuentas Google requiere verificar tu identidad
              nuevamente y aún no está disponible en VitaPlena.
            </p>
            <p style={{ color: '#c62828', fontWeight: 600 }}>
              ⚠️ Mientras tanto, puedes solicitar la eliminación de tu cuenta
              por WhatsApp.
            </p>
            <a href="/eliminar-cuenta" className="btn btn-danger">
              📱 Solicitar eliminación por WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={solicitarEliminacion}>
            <p style={{ color: '#c62828', fontWeight: 600 }}>
              ⚠️ Esta acción es permanente e irreversible. Se eliminarán tu
              cuenta, tu perfil, tus datos y todo tu historial de forma
              definitiva.
            </p>
            <input
              type="password"
              className="input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '8px 0',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={confirmado}
                onChange={(e) => setConfirmado(e.target.checked)}
              />
              Entiendo que la eliminación es permanente e irreversible
            </label>
            {estado === 'error' && (
              <p style={{ color: '#c62828' }}>{mensaje}</p>
            )}
            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: '100%', marginTop: 8 }}
              disabled={!password || !confirmado || cargando}
            >
              {cargando ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </button>
          </form>
        )}
      </div>

      {confirmarModal && (
        <div className="modal" onClick={() => setConfirmarModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>¿Confirmar eliminación?</h3>
            <p>
              Esta acción es <strong>permanente e irreversible</strong>. Tu
              cuenta y todos tus datos serán eliminados. ¿Deseas continuar?
            </p>
            {estado === 'error' && (
              <p style={{ color: '#c62828' }}>{mensaje}</p>
            )}
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 16
              }}
            >
              <button
                className="btn"
                onClick={() => setConfirmarModal(false)}
                disabled={cargando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={ejecutarEliminacion}
                disabled={cargando}
              >
                {cargando ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ajustes;
