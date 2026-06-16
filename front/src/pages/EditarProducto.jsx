import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const EditarProducto = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);

    const [formulario, setFormulario] = useState({
        codigo_producto: '',
        nombre_producto: '',
        descripcion: '',
        precio_venta: '',
        estado: 1,
        Categoria_id_categoria: '',
        Marca_id_marca: ''
    });

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resProducto = await api.get(`/productos/${id}`);
                const resCategorias = await api.get('/categorias');
                const resMarcas = await api.get('/marcas');

                setFormulario({
                    codigo_producto: resProducto.data.codigo_producto,
                    nombre_producto: resProducto.data.nombre_producto,
                    descripcion: resProducto.data.descripcion || '',
                    precio_venta: resProducto.data.precio_venta,
                    estado: resProducto.data.estado,
                    Categoria_id_categoria: resProducto.data.Categoria_id_categoria,
                    Marca_id_marca: resProducto.data.Marca_id_marca
                });

                setCategorias(resCategorias.data);
                setMarcas(resMarcas.data);
            } catch (error) {
                setError('Error al cargar datos del producto');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarDatos();
    }, [id]);

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

        try {
            await api.put(`/productos/${id}`, {
                ...formulario,
                precio_venta: Number(formulario.precio_venta),
                estado: Number(formulario.estado),
                Categoria_id_categoria: Number(formulario.Categoria_id_categoria),
                Marca_id_marca: Number(formulario.Marca_id_marca)
            });

            setExito('Producto actualizado correctamente');

            setTimeout(() => {
                navigate('/productos');
            }, 1000);

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al actualizar producto');
        } finally {
            setCargando(false);
        }
    };

    if (cargandoDatos) {
        return <Loading mensaje="Cargando producto..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Producto</h2>

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

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Estado</label>
                                <select
                                    name="estado"
                                    className="form-select"
                                    value={formulario.estado}
                                    onChange={manejarCambio}
                                >
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>

                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={cargando}
                            >
                                {cargando ? 'Actualizando...' : 'Actualizar producto'}
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

export default EditarProducto;