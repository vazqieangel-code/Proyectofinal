import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const NuevoInventario = () => {

    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [colores, setColores] = useState([]);

    const [formulario, setFormulario] = useState({
        stock: '',
        stock_minimo: '',
        Producto_id_producto: '',
        Talla_id_talla: '',
        Color_id_color: ''
    });

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resProductos = await api.get('/productos');
                const resTallas = await api.get('/tallas');
                const resColores = await api.get('/colores');

                setProductos(resProductos.data);
                setTallas(resTallas.data);
                setColores(resColores.data);
            } catch (error) {
                setError('Error al cargar datos del formulario');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarDatos();
    }, []);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');
        setCargando(true);

        if (
            formulario.stock === '' ||
            formulario.stock_minimo === '' ||
            !formulario.Producto_id_producto ||
            !formulario.Talla_id_talla ||
            !formulario.Color_id_color
        ) {
            setError('Completa todos los campos obligatorios');
            setCargando(false);
            return;
        }

        try {
            await api.post('/inventario', {
                stock: Number(formulario.stock),
                stock_minimo: Number(formulario.stock_minimo),
                Producto_id_producto: Number(formulario.Producto_id_producto),
                Talla_id_talla: Number(formulario.Talla_id_talla),
                Color_id_color: Number(formulario.Color_id_color)
            });

            setExito('Inventario registrado correctamente');

            setTimeout(() => {
                navigate('/inventario');
            }, 1000);

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al registrar inventario');
        } finally {
            setCargando(false);
        }
    };

    if (cargandoDatos) {
        return <Loading mensaje="Cargando formulario..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Nuevo Inventario</h2>

            <div className="card shadow">
                <div className="card-body">

                    {error && <ErrorMessage mensaje={error} />}

                    {exito && (
                        <div className="alert alert-success">
                            {exito}
                        </div>
                    )}

                    <form onSubmit={manejarSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Producto</label>
                                <select
                                    name="Producto_id_producto"
                                    className="form-select"
                                    value={formulario.Producto_id_producto}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Selecciona un producto</option>
                                    {productos.map((producto) => (
                                        <option
                                            key={producto.id_producto}
                                            value={producto.id_producto}
                                        >
                                            {producto.codigo_producto} - {producto.nombre_producto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Talla</label>
                                <select
                                    name="Talla_id_talla"
                                    className="form-select"
                                    value={formulario.Talla_id_talla}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Selecciona una talla</option>
                                    {tallas.map((talla) => (
                                        <option key={talla.id_talla} value={talla.id_talla}>
                                            {talla.nombre_talla}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Color</label>
                                <select
                                    name="Color_id_color"
                                    className="form-select"
                                    value={formulario.Color_id_color}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Selecciona un color</option>
                                    {colores.map((color) => (
                                        <option key={color.id_color} value={color.id_color}>
                                            {color.nombre_color}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    className="form-control"
                                    value={formulario.stock}
                                    onChange={manejarCambio}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Stock mínimo</label>
                                <input
                                    type="number"
                                    name="stock_minimo"
                                    className="form-control"
                                    value={formulario.stock_minimo}
                                    onChange={manejarCambio}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={cargando}
                            >
                                {cargando ? 'Guardando...' : 'Guardar inventario'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/inventario')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NuevoInventario;