import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function GraficosProgreso() {
  const [datosPeso, setDatosPeso] = useState(null);
  const [datosCalorias, setDatosCalorias] = useState(null);
  const [periodo, setPeriodo] = useState(30);

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    try {
      const [corporal, comidas] = await Promise.all([
        api.get(`/registros/corporal?limite=${periodo}`),
        api.get(`/alimentacion/comidas?limite=${periodo}`)
      ]);

      // Gráfico de peso
      const registros = corporal.data.registros || [];
      if (registros.length >= 2) {
        setDatosPeso({
          labels: registros.map(r => new Date(r.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })).reverse(),
          datasets: [{
            label: 'Peso (kg)',
            data: registros.map(r => r.peso_kg).reverse(),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33,150,243,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#2196F3'
          }]
        });
      }

      // Gráfico de calorías diarias
      const comidasArr = comidas.data.comidas || [];
      if (comidasArr.length > 0) {
        const porDia = {};
        comidasArr.forEach(c => {
          const dia = new Date(c.fecha_hora).toLocaleDateString('es', { day: 'numeric', month: 'short' });
          porDia[dia] = (porDia[dia] || 0) + parseFloat(c.total_calorias || 0);
        });
        const dias = Object.keys(porDia).slice(-14);
        setDatosCalorias({
          labels: dias,
          datasets: [{
            label: 'Calorías diarias',
            data: dias.map(d => porDia[d]),
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255,152,0,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#FF9800'
          }]
        });
      }
    } catch (err) {
      console.error('Error al cargar gráficos');
    }
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[7, 15, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => setPeriodo(d)}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: 12,
              background: periodo === d ? '#2196F3' : '#e0e0e0',
              color: periodo === d ? 'white' : '#666'
            }}
          >
            {d} días
          </button>
        ))}
      </div>

      {datosPeso ? (
        <div className="card">
          <h4>📈 Evolución de Peso</h4>
          <Line data={datosPeso} options={opciones} />
        </div>
      ) : (
        <div className="card">
          <p style={{ color: '#888', textAlign: 'center' }}>Registra tu peso para ver el gráfico de progreso.</p>
        </div>
      )}

      {datosCalorias ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h4>🔥 Calorías por Día</h4>
          <Line data={datosCalorias} options={opciones} />
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <p style={{ color: '#888', textAlign: 'center' }}>Registra tus comidas para ver las calorías diarias.</p>
        </div>
      )}
    </div>
  );
}

export default GraficosProgreso;