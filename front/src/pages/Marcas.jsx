import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Marcas = () => {

    const [marcas, setMarcas] = useState([]);
    const [nombreMarca, setNombreMarca] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editando, setEditando] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarMarcas = async () => {
        try {
            const respuesta = await api.get('/marcas');
            setMarcas(respuesta.data);
        } catch (error) {
            setError('Error al cargar marcas');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMarcas();
    }, []);

    const guardarMarca = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');

        if (!nombreMarca.trim()) {
            setError('El nombre de la marca es obligatorio');
            return;
        }

        try {
            if (editando) {
                await api.put(`/marcas/${editando}`, {
                    nombre_marca: nombreMarca,
                    descripcion
                });

                setExito('Marca actualizada correctamente');
            } else {
                await api.post('/marcas', {
                    nombre_marca: nombreMarca,
                    descripcion
                });

                setExito('Marca registrada correctamente');
            }

            setNombreMarca('');
            setDescripcion('');
            setEditando(null);
            cargarMarcas();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al guardar marca');
        }
    };

    const editarMarca = (marca) => {
        setNombreMarca(marca.nombre_marca);
        setDescripcion(marca.descripcion || '');
        setEditando(marca.id_marca);
    };

    const eliminarMarca = async (id) => {
        const confirmar = window.confirm('¿Eliminar esta marca?');

        if (!confirmar) return;

        try {
            await api.delete(`/marcas/${id}`);
            setExito('Marca eliminada correctamente');
            cargarMarcas();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'No se pudo eliminar la marca');
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando marcas..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Marcas</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={guardarMarca}>
                        <div className="mb-3">
                            <label className="form-label">Nombre de la marca</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombreMarca}
                                onChange={(e) => setNombreMarca(e.target.value)}
                                placeholder="Ejemplo: Nike"
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
                                        setNombreMarca('');
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
                                <th>Marca</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {marcas.map((marca) => (
                                <tr key={marca.id_marca}>
                                    <td>{marca.id_marca}</td>
                                    <td>{marca.nombre_marca}</td>
                                    <td>{marca.descripcion}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarMarca(marca)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarMarca(marca.id_marca)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {marcas.length === 0 && (
                        <p className="text-center text-muted">
                            No hay marcas registradas.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marcas;