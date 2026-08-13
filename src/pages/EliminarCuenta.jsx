import env from '../config/env';
import { openUrl } from '../services/platform';

const TITULO_HEADER = '🏃 VitaPlena';

function EliminarCuenta() {
  const mensajeWhatsApp = encodeURIComponent(
    'Hola, quiero solicitar la ELIMINACIÓN de mi cuenta de VitaPlena. Mi correo de registro es: [coloca aquí tu correo]'
  );
  const enlaceWhatsApp = `https://wa.me/${env.whatsappContact}?text=${mensajeWhatsApp}`;

  const solicitarEliminacion = (e) => {
    e.preventDefault();
    openUrl(enlaceWhatsApp);
  };

  return (
    <div>
      <div className="header">
        <h3>{TITULO_HEADER}</h3>
        <a
          href="/"
          style={{ color: 'white', textDecoration: 'none', fontSize: 14 }}
        >
          Volver al inicio
        </a>
      </div>

      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>🗑️ Eliminación de cuenta</h2>
          <p>
            En VitaPlena respetamos tu privacidad. Puedes solicitar en cualquier
            momento la eliminación de tu cuenta y de tus datos personales de la
            aplicación.
          </p>
        </div>

        <div className="card">
          <h3>¿Cómo solicitar la eliminación de mi cuenta?</h3>
          <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>
              Pulsa el botón <strong>“Solicitar eliminación por WhatsApp”</strong>{' '}
              (o escribe tú mismo al número indicado al final de esta página).
            </li>
            <li>
              En el mensaje, indica el correo electrónico que usas para iniciar
              sesión en VitaPlena.
            </li>
            <li>
              El desarrollador de VitaPlena procesará tu solicitud y confirmará
              la eliminación de tu cuenta por el mismo medio.
            </li>
          </ol>
          <button
            className="btn btn-danger"
            onClick={solicitarEliminacion}
            style={{ marginTop: 8 }}
          >
            📱 Solicitar eliminación por WhatsApp
          </button>
          <p style={{ fontSize: 13, marginTop: 12 }}>
            La solicitud será procesada por el desarrollador. La eliminación no
            es inmediata: te contactaremos para verificar tu identidad y
            completar el proceso.
          </p>
        </div>

        <div className="card">
          <h3>Datos que se eliminarán</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Datos de tu perfil: nombre, correo electrónico y contraseña.</li>
            <li>Registros de alimentación, comidas y recetas guardadas.</li>
            <li>Entrenamientos, ejercicios, rutinas e historial de progreso.</li>
            <li>Medidas corporales e historial de tu evolución física.</li>
            <li>Registros de bienestar y sueño.</li>
            <li>Preferencias y configuración de la aplicación.</li>
          </ul>
        </div>

        <div className="card">
          <h3>Datos que podrían conservarse</h3>
          <p>
            Cierta información podría conservarse durante el plazo exigido por
            ley cuando exista una obligación legal o administrativa, por ejemplo:
          </p>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>
              Registros necesarios para cumplir obligaciones fiscales,
              contables o legales aplicables.
            </li>
            <li>
              Información requerida para resolver reclamaciones, prevenir
              fraudes o atender requerimientos de autoridades.
            </li>
            <li>
              Datos relacionados con compras o suscripciones que deban
              conservarse por los plazos legales de retención.
            </li>
          </ul>
          <p>
            Estos datos no se utilizan con fines comerciales y se eliminan en
            cuanto dejan de ser necesarios para cumplir dicha obligación.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Contacto del desarrollador</h3>
          <p>
            Para solicitar la eliminación de tu cuenta, escríbenos por WhatsApp:{' '}
            <strong>+{env.whatsappContact}</strong>
          </p>
          <a href="/" className="btn btn-primary" style={{ display: 'inline-block' }}>
            🏠 Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
}

export default EliminarCuenta;
