import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem('usuario');

        return usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    });

    const login = (datosUsuario, token) => {

        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        setUsuario(datosUsuario);
    };

    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setUsuario(null);
    };

    const esAdmin = usuario?.rol === 'Administrador';
    const esVendedor = usuario?.rol === 'Vendedor';

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                esAdmin,
                esVendedor
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};