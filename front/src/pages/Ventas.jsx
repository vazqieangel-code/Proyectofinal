import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TablaVentas from '../components/TablaVentas';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Ventas = () => {

    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarVentas = async () => {
            try {
                const respuesta = await api.get('/ventas');
                setVentas(respuesta.data);
            } catch (error) {
                setError('Error al cargar ventas');
            } finally {
                setCargando(false);
            }
        };

        cargarVentas();
    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando ventas..." />;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Ventas</h2>

                <Link to="/ventas/nueva" className="btn btn-primary">
                    Nueva Venta
                </Link>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {!error && <TablaVentas ventas={ventas} />}
        </div>
    );
};

export default Ventas;