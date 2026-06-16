import { useRef, useState } from 'react';
import api from '../services/api';
import TablaProductos from '../components/TablaProductos';
import ErrorMessage from '../components/ErrorMessage';

const BusquedaNoControlada = () => {

    const busquedaRef = useRef(null);

    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const buscarProductos = async (e) => {
        e.preventDefault();

        setError('');
        setCargando(true);

        const termino = busquedaRef.current.value.trim();

        try {
            const respuesta = await api.get('/productos');

            const filtrados = respuesta.data.filter((producto) =>
                producto.nombre_producto
                    .toLowerCase()
                    .includes(termino.toLowerCase())
            );

            setProductos(filtrados);
        } catch (error) {
            setError('Error al buscar productos');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Búsqueda No Controlada</h2>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={buscarProductos}>
                        <label className="form-label">
                            Buscar producto
                        </label>

                        <input
                            type="text"
                            ref={busquedaRef}
                            className="form-control mb-3"
                            placeholder="Ejemplo: playera"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <TablaProductos productos={productos} />
        </div>
    );
};

export default BusquedaNoControlada;