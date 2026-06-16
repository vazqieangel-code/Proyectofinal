import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const MainLayout = () => {

    const { usuario, logout, esAdmin, esVendedor } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        logout();
        navigate('/');
    };

    const linkClass = ({ isActive }) =>
        isActive
            ? 'sidebar-link active'
            : 'sidebar-link';

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        TR
                    </div>

                    <div>
                        <h4>Tienda Ropa</h4>
                        <span>Punto de venta</span>
                    </div>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {usuario?.nombre?.charAt(0) || 'U'}
                    </div>

                    <div>
                        <strong>{usuario?.nombre || 'Usuario'}</strong>
                        <span>{usuario?.rol || 'Rol'}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    {esAdmin && (
                        <>
                            <p className="sidebar-section">Dashboard</p>

                            <NavLink to="/dashboard" className={linkClass}>
                                Dashboard
                            </NavLink>

                            <p className="sidebar-section">Inventario</p>

                            <NavLink to="/tallas" className={linkClass}>
                                Tallas
                            </NavLink>

                            <NavLink to="/colores" className={linkClass}>
                                Colores
                            </NavLink>

                            <NavLink to="/marcas" className={linkClass}>
                                Marcas
                            </NavLink>

                            <NavLink to="/categorias" className={linkClass}>
                                Categorías
                            </NavLink>

                            <NavLink to="/productos" className={linkClass}>
                                Productos
                            </NavLink>

                            <NavLink to="/inventario" className={linkClass}>
                                Inventario
                            </NavLink>
                        </>
                    )}

                    <p className="sidebar-section">Venta</p>

                    {esAdmin && (
                        <>
                            <NavLink to="/ventas" className={linkClass}>
                                Historial
                            </NavLink>

                            <NavLink to="/corte-caja" className={linkClass}>
                                Corte de caja
                            </NavLink>
                        </>
                    )}

                    {(esAdmin || esVendedor) && (
                        <NavLink to="/ventas/nueva" className={linkClass}>
                            Nueva venta
                        </NavLink>
                    )}

                    {esAdmin && (
                        <>
                            <p className="sidebar-section">Usuarios</p>

                            <NavLink to="/usuarios" className={linkClass}>
                                Usuarios
                            </NavLink>
                        </>
                    )}

                </nav>

                <button
                    className="sidebar-logout"
                    onClick={cerrarSesion}
                >
                    Cerrar sesión
                </button>
            </aside>

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;