import PropTypes from 'prop-types';

const ErrorMessage = ({ mensaje }) => {
    return (
        <div className="alert alert-danger mt-3" role="alert">
            {mensaje}
        </div>
    );
};

ErrorMessage.propTypes = {
    mensaje: PropTypes.string.isRequired
};

export default ErrorMessage;