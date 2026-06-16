import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const EditarInventario = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [inventario, setInventario] = useState({
        stock: '',
        stock_minimo: ''
    });

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {

        const cargarInventario = async () => {

            try {

                const respuesta =
                    await api.get(`/inventario/${id}`);

                setInventario({
                    stock: respuesta.data.stock,
                    stock_minimo: respuesta.data.stock_minimo
                });

            } catch (error) {

                setError(
                    'Error al cargar inventario'
                );

            } finally {

                setCargandoDatos(false);

            }
        };

        cargarInventario();

    }, [id]);

    const manejarCambio = (e) => {

        setInventario({
            ...inventario,
            [e.target.name]: e.target.value
        });

    };

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setExito('');
        setCargando(true);

        try {

            await api.put(
                `/inventario/${id}`,
                {
                    stock: Number(inventario.stock),
                    stock_minimo: Number(
                        inventario.stock_minimo
                    )
                }
            );

            setExito(
                'Inventario actualizado correctamente'
            );

            setTimeout(() => {

                navigate('/inventario');

            }, 1000);

        } catch (error) {

            setError(
                error.response?.data?.mensaje ||
                'Error al actualizar inventario'
            );

        } finally {

            setCargando(false);

        }
    };

    if (cargandoDatos) {

        return (
            <Loading mensaje="Cargando inventario..." />
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Editar Inventario
            </h2>

            <div className="card shadow">

                <div className="card-body">

                    {error && (
                        <ErrorMessage mensaje={error} />
                    )}

                    {exito && (
                        <div className="alert alert-success">
                            {exito}
                        </div>
                    )}

                    <form onSubmit={manejarSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                className="form-control"
                                value={inventario.stock}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Stock mínimo
                            </label>

                            <input
                                type="number"
                                name="stock_minimo"
                                className="form-control"
                                value={inventario.stock_minimo}
                                onChange={manejarCambio}
                                required
                            />

                        </div>

                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={cargando}
                            >
                                {cargando
                                    ? 'Actualizando...'
                                    : 'Actualizar'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate('/inventario')
                                }
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

export default EditarInventario;