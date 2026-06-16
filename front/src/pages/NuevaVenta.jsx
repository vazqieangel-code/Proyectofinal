import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const NuevaVenta = () => {

    const navigate = useNavigate();

    const [inventario, setInventario] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [carrito, setCarrito] = useState([]);
    const [metodoPago, setMetodoPago] = useState('');

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const metodosPago = [
        { id_metodo_pago: 1, nombre_metodo: 'Efectivo' },
        { id_metodo_pago: 2, nombre_metodo: 'Tarjeta simulada' },
        { id_metodo_pago: 3, nombre_metodo: 'Transferencia simulada' }
    ];

    useEffect(() => {
        const cargarInventario = async () => {
            try {
                const respuesta = await api.get('/inventario');
                setInventario(respuesta.data);
            } catch (error) {
                setError('Error al cargar inventario');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarInventario();

        return () => {
            setInventario([]);
            setCarrito([]);
            setError('');
            setExito('');
        };
    }, []);

    const totalVenta = useMemo(() => {
        return carrito.reduce((total, item) => total + item.subtotal, 0);
    }, [carrito]);

    const agregarAlCarrito = useCallback(() => {
        setError('');

        if (!productoSeleccionado || cantidad <= 0) {
            setError('Selecciona un producto y una cantidad válida');
            return;
        }

        const itemInventario = inventario.find(
            (item) => item.id_inventario === Number(productoSeleccionado)
        );

        if (!itemInventario) {
            setError('Producto no encontrado');
            return;
        }

        if (cantidad > itemInventario.stock) {
            setError('No hay suficiente stock disponible');
            return;
        }

        const existe = carrito.find(
            (item) => item.Inventario_id_inventario === itemInventario.id_inventario
        );

        if (existe) {
            setError('Ese producto ya está en el carrito');
            return;
        }

        const nuevoItem = {
            Inventario_id_inventario: itemInventario.id_inventario,
            nombre_producto: itemInventario.nombre_producto,
            codigo_producto: itemInventario.codigo_producto,
            talla: itemInventario.nombre_talla,
            color: itemInventario.nombre_color,
            cantidad: Number(cantidad),
            precio_unitario: Number(itemInventario.precio_venta),
            subtotal: Number(cantidad) * Number(itemInventario.precio_venta)
        };

        setCarrito((carritoActual) => [...carritoActual, nuevoItem]);
        setProductoSeleccionado('');
        setCantidad(1);

    }, [productoSeleccionado, cantidad, inventario, carrito]);

    const eliminarDelCarrito = useCallback((idInventario) => {
        setCarrito((carritoActual) =>
            carritoActual.filter(
                (item) => item.Inventario_id_inventario !== idInventario
            )
        );
    }, []);

    const finalizarVenta = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');
        setCargando(true);

        if (!metodoPago) {
            setError('Selecciona un método de pago');
            setCargando(false);
            return;
        }

        if (carrito.length === 0) {
            setError('Agrega productos al carrito');
            setCargando(false);
            return;
        }

        try {
            await api.post('/ventas', {
                MetodoPago_id_metodo_pago: Number(metodoPago),
                productos: carrito.map((item) => ({
                    Inventario_id_inventario: item.Inventario_id_inventario,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario
                }))
            });

            setExito('Venta registrada correctamente');

            setTimeout(() => {
                navigate('/ventas');
            }, 1000);

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al registrar venta');
        } finally {
            setCargando(false);
        }
    };

    if (cargandoDatos) {
        return <Loading mensaje="Cargando punto de venta..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Nueva Venta</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <h5>Agregar producto</h5>

                    <div className="row">
                        <div className="col-md-7 mb-3">
                            <label className="form-label">Producto</label>
                            <select
                                className="form-select"
                                value={productoSeleccionado}
                                onChange={(e) => setProductoSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un producto</option>
                                {inventario.map((item) => (
                                    <option
                                        key={item.id_inventario}
                                        value={item.id_inventario}
                                    >
                                        {item.codigo_producto} - {item.nombre_producto}
                                        {' | '}Talla: {item.nombre_talla}
                                        {' | '}Color: {item.nombre_color}
                                        {' | '}Stock: {item.stock}
                                        {' | '}Precio: ${item.precio_venta}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-3">
                            <label className="form-label">Cantidad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={cantidad}
                                min="1"
                                onChange={(e) => setCantidad(Number(e.target.value))}
                            />
                        </div>

                        <div className="col-md-2 mb-3 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-success w-100"
                                onClick={agregarAlCarrito}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={finalizarVenta}>
                <div className="card shadow">
                    <div className="card-body">
                        <h5>Carrito de venta</h5>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Talla</th>
                                    <th>Color</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                {carrito.map((item) => (
                                    <tr key={item.Inventario_id_inventario}>
                                        <td>{item.nombre_producto}</td>
                                        <td>{item.talla}</td>
                                        <td>{item.color}</td>
                                        <td>{item.cantidad}</td>
                                        <td>${item.precio_unitario}</td>
                                        <td>${item.subtotal}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarDelCarrito(item.Inventario_id_inventario)}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {carrito.length === 0 && (
                            <p className="text-center text-muted">
                                No hay productos en el carrito.
                            </p>
                        )}

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <label className="form-label">Método de pago</label>
                                <select
                                    className="form-select"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona método de pago</option>
                                    {metodosPago.map((metodo) => (
                                        <option
                                            key={metodo.id_metodo_pago}
                                            value={metodo.id_metodo_pago}
                                        >
                                            {metodo.nombre_metodo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 text-end">
                                <h4>Total: ${totalVenta}</h4>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={cargando}
                            >
                                {cargando ? 'Registrando...' : 'Finalizar venta'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/ventas')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NuevaVenta;