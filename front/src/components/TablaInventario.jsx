import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TablaInventario = ({ inventario }) => {
    return (
        <div className="card shadow">
            <div className="card-body">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Código</th>
                            <th>Talla</th>
                            <th>Color</th>
                            <th>Stock</th>
                            <th>Stock mínimo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {inventario.map((item) => (
                            <tr key={item.id_inventario}>
                                <td>{item.nombre_producto}</td>
                                <td>{item.codigo_producto}</td>
                                <td>{item.nombre_talla}</td>
                                <td>{item.nombre_color}</td>
                                <td>{item.stock}</td>
                                <td>{item.stock_minimo}</td>
                                <td>
                                    {item.stock <= item.stock_minimo ? (
                                        <span className="badge bg-danger">Stock bajo</span>
                                    ) : (
                                        <span className="badge bg-success">Disponible</span>
                                    )}
                                </td>
                                <td>
                                    <Link
                                        to={`/inventario/editar/${item.id_inventario}`}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {inventario.length === 0 && (
                    <p className="text-center text-muted">
                        No hay inventario registrado.
                    </p>
                )}
            </div>
        </div>
    );
};

TablaInventario.propTypes = {
    inventario: PropTypes.array.isRequired
};

export default TablaInventario;