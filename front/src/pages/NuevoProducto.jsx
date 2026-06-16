import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NuevoProducto = () => {

    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);

    const [formulario, setFormulario] = useState({
        codigo_producto: '',
        nombre_producto: '',
        descripcion: '',
        precio_venta: '',
        Categoria_id_categoria: '',
        Marca_id_marca: ''
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuestaCategorias = await api.get('/categorias');
                const respuestaMarcas = await api.get('/marcas');

                setCategorias(respuestaCategorias.data);
                setMarcas(respuestaMarcas.data);
            } catch (error) {
                setError('Error al cargar categorías o marcas');
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
            !formulario.codigo_producto ||
            !formulario.nombre_producto ||
            !formulario.precio_venta ||
            !formulario.Categoria_id_categoria ||
            !formulario.Marca_id_marca
        ) {
            setError('Completa todos los campos obligatorios');
            setCargando(false);
            return;
        }

        try {
            await api.post('/productos', {
                ...formulario,
                precio_venta: Number(formulario.precio_venta),
                Categoria_id_categoria: Number(formulario.Categoria_id_categoria),
                Marca_id_marca: Number(formulario.Marca_id_marca)
            });

            setExito('Producto registrado correctamente');

            setTimeout(() => {
                navigate('/productos');
            }, 1000);

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al registrar producto');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Nuevo Producto</h2>

            <div className="card shadow">
                <div className="card-body">

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {exito && (
                        <div className="alert alert-success">
                            {exito}
                        </div>
                    )}

                    <form onSubmit={manejarSubmit}>

                        <div className="row">

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Código</label>
                                <input
                                    type="text"
                                    name="codigo_producto"
                                    className="form-control"
                                    value={formulario.codigo_producto}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-8 mb-3">
                                <label className="form-label">Nombre del producto</label>
                                <input
                                    type="text"
                                    name="nombre_producto"
                                    className="form-control"
                                    value={formulario.nombre_producto}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    className="form-control"
                                    value={formulario.descripcion}
                                    onChange={manejarCambio}
                                    rows="3"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Precio de venta</label>
                                <input
                                    type="number"
                                    name="precio_venta"
                                    className="form-control"
                                    value={formulario.precio_venta}
                                    onChange={manejarCambio}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Categoría</label>
                                <select
                                    name="Categoria_id_categoria"
                                    className="form-select"
                                    value={formulario.Categoria_id_categoria}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id_categoria}
                                            value={categoria.id_categoria}
                                        >
                                            {categoria.nombre_categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Marca</label>
                                <select
                                    name="Marca_id_marca"
                                    className="form-select"
                                    value={formulario.Marca_id_marca}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Selecciona una marca</option>
                                    {marcas.map((marca) => (
                                        <option
                                            key={marca.id_marca}
                                            value={marca.id_marca}
                                        >
                                            {marca.nombre_marca}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={cargando}
                            >
                                {cargando ? 'Guardando...' : 'Guardar producto'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/productos')}
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

export default NuevoProducto;