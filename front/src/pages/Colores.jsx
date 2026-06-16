import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Colores = () => {

    const [colores, setColores] = useState([]);
    const [nombreColor, setNombreColor] = useState('');
    const [editando, setEditando] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarColores = async () => {
        try {
            const respuesta = await api.get('/colores');
            setColores(respuesta.data);
        } catch (error) {
            setError('Error al cargar colores');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarColores();
    }, []);

    const guardarColor = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');

        if (!nombreColor.trim()) {
            setError('El nombre del color es obligatorio');
            return;
        }

        try {
            if (editando) {
                await api.put(`/colores/${editando}`, {
                    nombre_color: nombreColor
                });
                setExito('Color actualizado correctamente');
            } else {
                await api.post('/colores', {
                    nombre_color: nombreColor
                });
                setExito('Color registrado correctamente');
            }

            setNombreColor('');
            setEditando(null);
            cargarColores();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al guardar color');
        }
    };

    const editarColor = (color) => {
        setNombreColor(color.nombre_color);
        setEditando(color.id_color);
    };

    const eliminarColor = async (id) => {
        const confirmar = window.confirm('¿Eliminar este color?');

        if (!confirmar) return;

        try {
            await api.delete(`/colores/${id}`);
            setExito('Color eliminado correctamente');
            cargarColores();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'No se pudo eliminar el color');
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando colores..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Colores</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={guardarColor}>
                        <label className="form-label">Nombre del color</label>

                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                value={nombreColor}
                                onChange={(e) => setNombreColor(e.target.value)}
                                placeholder="Ejemplo: Negro, Blanco, Azul"
                            />

                            <button className="btn btn-primary" type="submit">
                                {editando ? 'Actualizar' : 'Guardar'}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditando(null);
                                        setNombreColor('');
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
                                <th>Color</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {colores.map((color) => (
                                <tr key={color.id_color}>
                                    <td>{color.id_color}</td>
                                    <td>{color.nombre_color}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarColor(color)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarColor(color.id_color)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {colores.length === 0 && (
                        <p className="text-center text-muted">
                            No hay colores registrados.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Colores;