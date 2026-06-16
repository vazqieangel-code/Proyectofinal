import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Tallas = () => {

    const [tallas, setTallas] = useState([]);
    const [nombreTalla, setNombreTalla] = useState('');
    const [editando, setEditando] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarTallas = async () => {
        try {
            const respuesta = await api.get('/tallas');
            setTallas(respuesta.data);
        } catch (error) {
            setError('Error al cargar tallas');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTallas();
    }, []);

    const guardarTalla = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');

        if (!nombreTalla.trim()) {
            setError('El nombre de la talla es obligatorio');
            return;
        }

        try {
            if (editando) {
                await api.put(`/tallas/${editando}`, {
                    nombre_talla: nombreTalla
                });

                setExito('Talla actualizada correctamente');
            } else {
                await api.post('/tallas', {
                    nombre_talla: nombreTalla
                });

                setExito('Talla registrada correctamente');
            }

            setNombreTalla('');
            setEditando(null);
            cargarTallas();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al guardar talla');
        }
    };

    const editarTalla = (talla) => {
        setNombreTalla(talla.nombre_talla);
        setEditando(talla.id_talla);
    };

    const eliminarTalla = async (id) => {
        const confirmar = window.confirm('¿Eliminar esta talla?');

        if (!confirmar) return;

        try {
            await api.delete(`/tallas/${id}`);
            setExito('Talla eliminada correctamente');
            cargarTallas();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'No se pudo eliminar la talla');
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando tallas..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tallas</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={guardarTalla}>
                        <label className="form-label">Nombre de la talla</label>

                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                value={nombreTalla}
                                onChange={(e) => setNombreTalla(e.target.value)}
                                placeholder="Ejemplo: CH, M, G, XL"
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
                                        setNombreTalla('');
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
                                <th>Talla</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tallas.map((talla) => (
                                <tr key={talla.id_talla}>
                                    <td>{talla.id_talla}</td>
                                    <td>{talla.nombre_talla}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarTalla(talla)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarTalla(talla.id_talla)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {tallas.length === 0 && (
                        <p className="text-center text-muted">
                            No hay tallas registradas.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tallas;