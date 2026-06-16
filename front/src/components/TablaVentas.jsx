import PropTypes from 'prop-types';

const TablaVentas = ({ ventas }) => {
    return (
        <div className="card shadow">
            <div className="card-body">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Vendedor</th>
                            <th>Método de pago</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ventas.map((venta) => (
                            <tr key={venta.id_venta}>
                                <td>{venta.id_venta}</td>
                                <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                                <td>{venta.nombre_usuario} {venta.apellido_usuario}</td>
                                <td>{venta.nombre_metodo}</td>
                                <td>${venta.total}</td>
                                <td>
                                    <span className="badge bg-success">
                                        {venta.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ventas.length === 0 && (
                    <p className="text-center text-muted">
                        No hay ventas registradas.
                    </p>
                )}
            </div>
        </div>
    );
};

TablaVentas.propTypes = {
    ventas: PropTypes.array.isRequired
};

export default TablaVentas;