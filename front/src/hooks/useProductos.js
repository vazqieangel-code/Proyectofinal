import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useProductos = () => {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const obtenerProductos = useCallback(async () => {
        try {

            setCargando(true);

            const respuesta = await api.get('/productos');

            setProductos(respuesta.data);

        } catch (error) {

            setError('Error al cargar productos');

        } finally {

            setCargando(false);

        }
    }, []);

    const eliminarProducto = async (id) => {

        try {

            await api.delete(`/productos/${id}`);

            await obtenerProductos();

            return true;

        } catch (error) {

            return false;

        }
    };

    useEffect(() => {
        obtenerProductos();
    }, [obtenerProductos]);

    return {
        productos,
        cargando,
        error,
        eliminarProducto,
        recargarProductos: obtenerProductos
    };
};

export default useProductos;