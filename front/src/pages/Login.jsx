import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        usuario: '',
        contraseña: ''
    });

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setCargando(true);

        try {
            const respuesta = await api.post('/auth/login', formulario);

            const datosUsuario = respuesta.data.usuario;

            login(datosUsuario, respuesta.data.token);

            if (datosUsuario.rol === 'Administrador') {
                navigate('/dashboard');
            } else if (datosUsuario.rol === 'Vendedor') {
                navigate('/ventas/nueva');
            } else {
                navigate('/');
            }

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al iniciar sesión');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-3">Tienda de Ropa</h3>
                <p className="text-center text-muted">Inicio de sesión</p>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            className="form-control"
                            value={formulario.usuario}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            className="form-control"
                            value={formulario.contraseña}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={cargando}
                    >
                        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;