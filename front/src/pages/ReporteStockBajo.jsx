import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ReporteStockBajo = () => {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarReporte = async () => {
            try {
                const respuesta = await api.get('/reportes/stock-bajo');
                setProductos(respuesta.data);
            } catch (error) {
                setError('Error al cargar productos con stock bajo');
            } finally {
                setCargando(false);
            }
        };

        cargarReporte();
    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando stock bajo..." />;
    }

    if (error) {
        return <ErrorMessage mensaje={error} />;
    }

    return (
        <div className="card shadow">
            <div className="card-body">
                <h4 className="mb-4">Productos con Stock Bajo</h4>

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Inventario</th>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Talla</th>
                            <th>Color</th>
                            <th>Stock</th>
                            <th>Stock mínimo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id_inventario}>
                                <td>{producto.id_inventario}</td>
                                <td>{producto.codigo_producto}</td>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.nombre_talla}</td>
                                <td>{producto.nombre_color}</td>
                                <td>
                                    <span className="badge bg-danger">
                                        {producto.stock}
                                    </span>
                                </td>
                                <td>{producto.stock_minimo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productos.length === 0 && (
                    <p className="text-center text-muted">
                        No hay productos con stock bajo.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReporteStockBajo;