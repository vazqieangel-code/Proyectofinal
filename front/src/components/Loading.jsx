import PropTypes from 'prop-types';

const Loading = ({ mensaje }) => {
    return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <h5>{mensaje}</h5>
        </div>
    );
};

Loading.propTypes = {
    mensaje: PropTypes.string
};

Loading.defaultProps = {
    mensaje: 'Cargando...'
};

export default Loading;