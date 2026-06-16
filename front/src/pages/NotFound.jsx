import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <h3>Página no encontrada</h3>
            <p className="text-muted">
                La ruta que intentaste abrir no existe.
            </p>

            <Link to="/dashboard" className="btn btn-primary">
                Volver al dashboard
            </Link>
        </div>
    );
};

export default NotFound;