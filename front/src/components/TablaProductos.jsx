import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TablaProductos = ({
    productos,
    onEliminar
}) => {

    const eliminar = async (id, nombre) => {

        const confirmar = window.confirm(
            `¿Eliminar ${nombre}?`
        );

        if (!confirmar) return;

        const eliminado =
            await onEliminar(id);

        if (eliminado) {

            alert(
                'Producto eliminado correctamente'
            );

        } else {

            alert(
                'No fue posible eliminar el producto'
            );
        }
    };

    return (
        <div className="card shadow">

            <div className="card-body">

                <table className="table table-striped table-hover">

                    <thead>

                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Marca</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>

                    </thead>

                    <tbody>

                        {productos.map((producto) => (

                            <tr key={producto.id_producto}>

                                <td>
                                    {producto.codigo_producto}
                                </td>

                                <td>

                                    <Link
                                        to={`/productos/${producto.id_producto}`}
                                    >
                                        {producto.nombre_producto}
                                    </Link>

                                </td>

                                <td>
                                    {producto.nombre_categoria}
                                </td>

                                <td>
                                    {producto.nombre_marca}
                                </td>

                                <td>
                                    $
                                    {producto.precio_venta}
                                </td>

                                <td>

                                    {producto.estado === 1 ? (
                                        <span className="badge bg-success">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="badge bg-secondary">
                                            Inactivo
                                        </span>
                                    )}

                                </td>

                                <td>

                                    <div className="d-flex gap-2">

                                        <Link
                                            to={`/productos/editar/${producto.id_producto}`}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Editar
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                eliminar(
                                                    producto.id_producto,
                                                    producto.nombre_producto
                                                )
                                            }
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

TablaProductos.propTypes = {
    productos: PropTypes.array.isRequired,
    onEliminar: PropTypes.func.isRequired
};

export default TablaProductos;