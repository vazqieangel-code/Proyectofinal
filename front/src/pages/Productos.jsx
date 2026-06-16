import { useSearchParams } from 'react-router-dom';

import TablaProductos from '../components/TablaProductos';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

import useProductos from '../hooks/useProductos';

const Productos = () => {

    const {
        productos,
        cargando,
        error,
        eliminarProducto
    } = useProductos();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const terminoBusqueda =
        searchParams.get('buscar') || '';

    const productosFiltrados = productos.filter(
        (producto) =>
            producto.nombre_producto
                .toLowerCase()
                .includes(
                    terminoBusqueda.toLowerCase()
                )
    );

    const manejarBusqueda = (e) => {

        const valor = e.target.value;

        if (valor.trim() === '') {

            setSearchParams({});

        } else {

            setSearchParams({
                buscar: valor
            });

        }
    };

    if (cargando) {
        return (
            <Loading mensaje="Cargando productos..." />
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Productos
            </h2>

            <div className="card shadow mb-4">

                <div className="card-body">

                    <label className="form-label">
                        Buscar producto
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={terminoBusqueda}
                        onChange={manejarBusqueda}
                        placeholder="Buscar..."
                    />

                </div>

            </div>

            {error && (
                <ErrorMessage mensaje={error} />
            )}

            {!error && (
                <TablaProductos
                    productos={productosFiltrados}
                    onEliminar={eliminarProducto}
                />
            )}

        </div>
    );
};

export default Productos;