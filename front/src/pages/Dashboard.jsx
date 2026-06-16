import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {

    const [resumen, setResumen] = useState(null);
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [stockBajo, setStockBajo] = useState([]);
    const [ultimasVentas, setUltimasVentas] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarDashboard = async () => {

            try {
                const [
                    resResumen,
                    resProductos,
                    resStock,
                    resVentas
                ] = await Promise.all([
                    api.get('/dashboard/resumen'),
                    api.get('/reportes/productos-mas-vendidos'),
                    api.get('/reportes/stock-bajo'),
                    api.get('/reportes/ventas')
                ]);

                setResumen(resResumen.data);
                setProductosVendidos(resProductos.data.slice(0, 5));
                setStockBajo(resStock.data.slice(0, 5));
                setUltimasVentas(resVentas.data.slice(0, 5));

            } catch (error) {
                setError('Error al cargar dashboard');
            } finally {
                setCargando(false);
            }
        };

        cargarDashboard();

    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando dashboard..." />;
    }

    if (error) {
        return <ErrorMessage mensaje={error} />;
    }

    return (
        <div className="container-fluid mt-4 px-4">

            <h2 className="mb-4">Dashboard</h2>

            <div className="row">

                <div className="col-md-3 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h6 className="text-muted">Productos activos</h6>
                            <h2>{resumen.productos}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h6 className="text-muted">Usuarios activos</h6>
                            <h2>{resumen.usuarios}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h6 className="text-muted">Ventas hoy</h6>
                            <h2>{resumen.ventas_hoy}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h6 className="text-muted">Total vendido hoy</h6>
                            <h2>${resumen.total_ventas_hoy}</h2>
                        </div>
                    </div>
                </div>

            </div>

            {resumen.stock_bajo > 0 && (
                <div className="alert alert-warning">
                    Hay <strong>{resumen.stock_bajo}</strong> productos con stock bajo.
                </div>
            )}

            <div className="row">

                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-body">
                            <h5 className="mb-3">Top productos vendidos</h5>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Total generado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {productosVendidos.map((producto) => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.total_vendido}</td>
                                            <td>${producto.total_generado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {productosVendidos.length === 0 && (
                                <p className="text-muted text-center">
                                    Aún no hay productos vendidos.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-body">
                            <h5 className="mb-3">Stock bajo</h5>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Talla</th>
                                        <th>Color</th>
                                        <th>Stock</th>
                                        <th>Mínimo</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stockBajo.map((item) => (
                                        <tr key={item.id_inventario}>
                                            <td>{item.nombre_producto}</td>
                                            <td>{item.nombre_talla}</td>
                                            <td>{item.nombre_color}</td>
                                            <td>
                                                <span className="badge bg-danger">
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td>{item.stock_minimo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {stockBajo.length === 0 && (
                                <p className="text-muted text-center">
                                    No hay productos con stock bajo.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Últimas ventas</h5>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Vendedor</th>
                                <th>Método</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ultimasVentas.map((venta) => (
                                <tr key={venta.id_venta}>
                                    <td>{venta.id_venta}</td>
                                    <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                                    <td>{venta.vendedor}</td>
                                    <td>{venta.nombre_metodo}</td>
                                    <td>${venta.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {ultimasVentas.length === 0 && (
                        <p className="text-muted text-center">
                            No hay ventas registradas.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;