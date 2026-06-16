import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Categorias = () => {

    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editando, setEditando] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarCategorias = async () => {
        try {
            const respuesta = await api.get('/categorias');
            setCategorias(respuesta.data);
        } catch (error) {
            setError('Error al cargar categorías');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const guardarCategoria = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');

        if (!nombreCategoria.trim()) {
            setError('El nombre de la categoría es obligatorio');
            return;
        }

        try {
            if (editando) {
                await api.put(`/categorias/${editando}`, {
                    nombre_categoria: nombreCategoria,
                    descripcion
                });

                setExito('Categoría actualizada correctamente');
            } else {
                await api.post('/categorias', {
                    nombre_categoria: nombreCategoria,
                    descripcion
                });

                setExito('Categoría registrada correctamente');
            }

            setNombreCategoria('');
            setDescripcion('');
            setEditando(null);
            cargarCategorias();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al guardar categoría');
        }
    };

    const editarCategoria = (categoria) => {
        setNombreCategoria(categoria.nombre_categoria);
        setDescripcion(categoria.descripcion || '');
        setEditando(categoria.id_categoria);
    };

    const eliminarCategoria = async (id) => {
        const confirmar = window.confirm('¿Eliminar esta categoría?');

        if (!confirmar) return;

        try {
            await api.delete(`/categorias/${id}`);
            setExito('Categoría eliminada correctamente');
            cargarCategorias();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'No se pudo eliminar la categoría');
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando categorías..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Categorías</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={guardarCategoria}>
                        <div className="mb-3">
                            <label className="form-label">Nombre de la categoría</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombreCategoria}
                                onChange={(e) => setNombreCategoria(e.target.value)}
                                placeholder="Ejemplo: Playeras"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows="2"
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="submit">
                                {editando ? 'Actualizar' : 'Guardar'}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditando(null);
                                        setNombreCategoria('');
                                        setDescripcion('');
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Categoría</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.id_categoria}>
                                    <td>{categoria.id_categoria}</td>
                                    <td>{categoria.nombre_categoria}</td>
                                    <td>{categoria.descripcion}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarCategoria(categoria)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarCategoria(categoria.id_categoria)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {categorias.length === 0 && (
                        <p className="text-center text-muted">
                            No hay categorías registradas.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categorias;