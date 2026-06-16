import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ReporteProductos = () => {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarReporte = async () => {
            try {
                const respuesta = await api.get('/reportes/productos-mas-vendidos');
                setProductos(respuesta.data);
            } catch (error) {
                setError('Error al cargar productos más vendidos');
            } finally {
                setCargando(false);
            }
        };

        cargarReporte();
    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando productos más vendidos..." />;
    }

    if (error) {
        return <ErrorMessage mensaje={error} />;
    }

    return (
        <div className="card shadow">
            <div className="card-body">
                <h4 className="mb-4">Productos Más Vendidos</h4>

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Producto</th>
                            <th>Producto</th>
                            <th>Total Vendido</th>
                            <th>Total Generado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id_producto}>
                                <td>{producto.id_producto}</td>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.total_vendido}</td>
                                <td>${producto.total_generado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productos.length === 0 && (
                    <p className="text-center text-muted">
                        No hay productos vendidos todavía.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReporteProductos;