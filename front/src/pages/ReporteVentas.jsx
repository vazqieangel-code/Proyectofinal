import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ReporteVentas = () => {

    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarReporte = async () => {
            try {
                const respuesta = await api.get('/reportes/ventas');
                setVentas(respuesta.data);
            } catch (error) {
                setError('Error al cargar reporte de ventas');
            } finally {
                setCargando(false);
            }
        };

        cargarReporte();

    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando reporte de ventas..." />;
    }

    if (error) {
        return <ErrorMessage mensaje={error} />;
    }

    return (
        <div className="card shadow">
            <div className="card-body">

                <h4 className="mb-4">Reporte de Ventas</h4>

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Venta</th>
                            <th>Fecha</th>
                            <th>Vendedor</th>
                            <th>Método de pago</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ventas.map((venta) => (
                            <tr key={venta.id_venta}>
                                <td>{venta.id_venta}</td>
                                <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                                <td>{venta.vendedor}</td>
                                <td>{venta.nombre_metodo}</td>
                                <td>${venta.total}</td>
                                <td>
                                    <span className="badge bg-success">
                                        {venta.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ventas.length === 0 && (
                    <p className="text-center text-muted">
                        No hay ventas registradas.
                    </p>
                )}

            </div>
        </div>
    );
};

export default ReporteVentas;