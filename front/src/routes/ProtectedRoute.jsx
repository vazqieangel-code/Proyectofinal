import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, rolesPermitidos }) => {

    const { usuario } = useAuth();
    const token = localStorage.getItem('token');

    if (!usuario && !token) {
        return <Navigate to="/" replace />;
    }

    if (
        rolesPermitidos &&
        usuario &&
        !rolesPermitidos.includes(usuario.rol)
    ) {
        if (usuario.rol === 'Vendedor') {
            return <Navigate to="/ventas/nueva" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    rolesPermitidos: PropTypes.array
};

export default ProtectedRoute;