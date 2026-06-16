import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DetalleProducto = () => {

    const { id } = useParams();

    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarProducto = async () => {

            try {

                const respuesta = await api.get(`/productos/${id}`);

                setProducto(respuesta.data);

            } catch (error) {

                setError('Error al cargar producto');

            } finally {

                setCargando(false);

            }
        };

        cargarProducto();

    }, [id]);

    if (cargando) {
        return <Loading mensaje="Cargando producto..." />;
    }

    if (error) {
        return <ErrorMessage mensaje={error} />;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Detalle del Producto
            </h2>

            <div className="card shadow">

                <div className="card-body">

                    <h3>{producto.nombre_producto}</h3>

                    <hr />

                    <p>
                        <strong>Código:</strong>{' '}
                        {producto.codigo_producto}
                    </p>

                    <p>
                        <strong>Descripción:</strong>{' '}
                        {producto.descripcion}
                    </p>

                    <p>
                        <strong>Precio:</strong>{' '}
                        ${producto.precio_venta}
                    </p>

                    <p>
                        <strong>Categoría:</strong>{' '}
                        {producto.nombre_categoria}
                    </p>

                    <p>
                        <strong>Marca:</strong>{' '}
                        {producto.nombre_marca}
                    </p>

                    <p>
                        <strong>Estado:</strong>{' '}
                        {producto.estado === 1
                            ? 'Activo'
                            : 'Inactivo'}
                    </p>

                    <Link
                        to="/productos"
                        className="btn btn-secondary"
                    >
                        Regresar
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default DetalleProducto;