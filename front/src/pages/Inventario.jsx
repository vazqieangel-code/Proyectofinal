import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TablaInventario from '../components/TablaInventario';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Inventario = () => {

    const [inventario, setInventario] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarInventario = async () => {
            try {
                const respuesta = await api.get('/inventario');
                setInventario(respuesta.data);
            } catch (error) {
                setError('Error al cargar inventario');
            } finally {
                setCargando(false);
            }
        };

        cargarInventario();
    }, []);

    if (cargando) {
        return <Loading mensaje="Cargando inventario..." />;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Inventario</h2>

                <Link to="/inventario/nuevo" className="btn btn-primary">
                    Nuevo Inventario
                </Link>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {!error && <TablaInventario inventario={inventario} />}
        </div>
    );
};

export default Inventario;