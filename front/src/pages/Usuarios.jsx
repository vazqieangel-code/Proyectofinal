import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Usuarios = () => {

    const [usuarios, setUsuarios] = useState([]);

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        usuario: '',
        contraseña: '',
        telefono: '',
        estado: 1,
        Rol_id_rol: 2
    });

    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarUsuarios = async () => {
        try {
            const respuesta = await api.get('/usuarios');
            setUsuarios(respuesta.data);
        } catch (error) {
            setError('Error al cargar usuarios');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: '',
            apellido: '',
            usuario: '',
            contraseña: '',
            telefono: '',
            estado: 1,
            Rol_id_rol: 2
        });

        setEditando(null);
    };

    const guardarUsuario = async (e) => {
        e.preventDefault();

        setError('');
        setExito('');

        if (
            !formulario.nombre ||
            !formulario.apellido ||
            !formulario.usuario ||
            !formulario.Rol_id_rol
        ) {
            setError('Completa los campos obligatorios');
            return;
        }

        try {
            if (editando) {
                await api.put(`/usuarios/${editando}`, {
                    nombre: formulario.nombre,
                    apellido: formulario.apellido,
                    usuario: formulario.usuario,
                    telefono: formulario.telefono,
                    estado: Number(formulario.estado),
                    Rol_id_rol: Number(formulario.Rol_id_rol)
                });

                setExito('Usuario actualizado correctamente');
            } else {
                if (!formulario.contraseña) {
                    setError('La contraseña es obligatoria para crear usuario');
                    return;
                }

                await api.post('/usuarios', {
                    ...formulario,
                    estado: Number(formulario.estado),
                    Rol_id_rol: Number(formulario.Rol_id_rol)
                });

                setExito('Usuario registrado correctamente');
            }

            limpiarFormulario();
            cargarUsuarios();

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al guardar usuario');
        }
    };

    const editarUsuario = (usuario) => {
        setFormulario({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario: usuario.usuario,
            contraseña: '',
            telefono: usuario.telefono || '',
            estado: usuario.estado,
            Rol_id_rol: usuario.Rol_id_rol
        });

        setEditando(usuario.id_usuario);
    };

    const eliminarUsuario = async (id) => {
        const confirmar = window.confirm('¿Desactivar este usuario?');

        if (!confirmar) return;

        try {
            await api.delete(`/usuarios/${id}`);
            setExito('Usuario desactivado correctamente');
            cargarUsuarios();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'No se pudo desactivar el usuario');
        }
    };

    if (cargando) {
        return <Loading mensaje="Cargando usuarios..." />;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Usuarios</h2>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="alert alert-success">
                    {exito}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={guardarUsuario}>
                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    className="form-control"
                                    value={formulario.apellido}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
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

                            {!editando && (
                                <div className="col-md-4 mb-3">
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
                            )}

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    className="form-control"
                                    value={formulario.telefono}
                                    onChange={manejarCambio}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Rol</label>
                                <select
                                    name="Rol_id_rol"
                                    className="form-select"
                                    value={formulario.Rol_id_rol}
                                    onChange={manejarCambio}
                                >
                                    <option value="1">Administrador</option>
                                    <option value="2">Vendedor</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Estado</label>
                                <select
                                    name="estado"
                                    className="form-select"
                                    value={formulario.estado}
                                    onChange={manejarCambio}
                                >
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>

                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="submit">
                                {editando ? 'Actualizar usuario' : 'Guardar usuario'}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                                {usuarios.filter((item) => item.id_usuario !== 1).map((item) => (
                                <tr key={item.id_usuario}>
                                    <td>{item.id_usuario}</td>
                                    <td>{item.nombre} {item.apellido}</td>
                                    <td>{item.usuario}</td>
                                    <td>{item.telefono}</td>
                                    <td>{item.nombre_rol}</td>
                                    <td>
                                        {item.estado === 1 ? (
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
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarUsuario(item)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarUsuario(item.id_usuario)}
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {usuarios.length === 0 && (
                        <p className="text-center text-muted">
                            No hay usuarios registrados.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Usuarios;