import { NavLink, Outlet } from 'react-router-dom';

const Reportes = () => {

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Reportes
            </h2>

            <div className="card shadow mb-4">
                <div className="card-body">

                    <div className="nav nav-pills">

                        <NavLink
                            to="ventas"
                            className="nav-link"
                        >
                            Ventas
                        </NavLink>

                        <NavLink
                            to="productos"
                            className="nav-link"
                        >
                            Productos Más Vendidos
                        </NavLink>

                        <NavLink
                            to="stock"
                            className="nav-link"
                        >
                            Stock Bajo
                        </NavLink>

                    </div>

                </div>
            </div>

            <Outlet />

        </div>
    );
};

export default Reportes;