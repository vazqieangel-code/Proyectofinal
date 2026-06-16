import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CorteCaja = () => {

    const [cortes, setCortes] = useState([]);
    const [formulario, setFormulario] = useState({
        fecha_inicio: '',
        fecha_final: '',
        observaciones: ''
    });

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarCortes = async () => {
        try {
            const respuesta = await api.get('/cortes');
            setCortes(respuesta.data);
        } catch (error) {
            setError('Error al cargar cortes de caja');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCortes();
    }, []);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const generarCorteHoy = () => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');

        setFormulario({
            fecha_inicio: `${yyyy}-${mm}-${dd}T00:00`,
            fecha_final: `${yyyy}-${mm}-${dd}T23:59`,
            observaciones: 'Corte de caja del día'
        });
    };

    const convertirFecha = (fecha) => {
        return fecha.replace('T', ' ') + ':00';
    };

    const guardarCorte = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');
        setGuardando(true);

        if (!formulario.fecha_inicio || !formulario.fecha_final) {
            setError('Selecciona fecha de inicio y fecha final');
            setGuardando(false);
            return;
        }

        try {
            const respuesta = await api.post('/cortes', {
                fecha_inicio: convertirFecha(formulario.fecha_inicio),
                fecha_final: convertirFecha(formulario.fecha_final),
                observaciones: formulario.observaciones
            });

            setExito(`Corte generado correctamente. Total: $${respuesta.data.total_ventas}`);

            setFormulario({
                fecha_inicio: '',
                fecha_final: '',
                observaciones: ''
            });

            cargarCortes();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al generar corte de caja');
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando cortes de caja..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Corte de Caja</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Generar corte</h5>

                    <form onSubmit={guardarCorte}>
                        <div className="row">

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fecha inicio</label>
                                <input
                                    type="datetime-local"
                                    name="fecha_inicio"
                                    className="form-control"
                                    value={formulario.fecha_inicio}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fecha final</label>
                                <input
                                    type="datetime-local"
                                    name="fecha_final"
                                    className="form-control"
                                    value={formulario.fecha_final}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3 d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100"
                                    onClick={generarCorteHoy}
                                >
                                    Usar día actual
                                </button>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">Observaciones</label>
                                <textarea
                                    name="observaciones"
                                    className="form-control"
                                    value={formulario.observaciones}
                                    onChange={manejarCambio}
                                    rows="2"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={guardando}
                        >
                            {guardando ? 'Generando...' : 'Generar corte'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <h5 className="mb-3">Historial de cortes</h5>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha inicio</th>
                                <th>Fecha final</th>
                                <th>Total ventas</th>
                                <th>Usuario</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cortes.map((corte) => (
                                <tr key={corte.id_corte}>
                                    <td>{corte.id_corte}</td>
                                    <td>{new Date(corte.fecha_inicio).toLocaleString()}</td>
                                    <td>{new Date(corte.fecha_final).toLocaleString()}</td>
                                    <td>${corte.total_ventas}</td>
                                    <td>{corte.nombre} {corte.apellido}</td>
                                    <td>{corte.observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cortes.length === 0 && (
                        <p className="text-center text-muted">
                            No hay cortes de caja registrados.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorteCaja;