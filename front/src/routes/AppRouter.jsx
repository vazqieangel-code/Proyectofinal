import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import {
    lazy,
    Suspense
} from 'react';

import Loading from '../components/Loading';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const Tallas = lazy(() => import('../pages/Tallas'));
const Colores = lazy(() => import('../pages/Colores'));
const Marcas = lazy(() => import('../pages/Marcas'));
const Categorias = lazy(() => import('../pages/Categorias'));
const Usuarios = lazy(() => import('../pages/Usuarios'));
const CorteCaja = lazy(() => import('../pages/CorteCaja'));

const Productos = lazy(() => import('../pages/Productos'));
const NuevoProducto = lazy(() => import('../pages/NuevoProducto'));
const EditarProducto = lazy(() => import('../pages/EditarProducto'));
const DetalleProducto = lazy(() => import('../pages/DetalleProducto'));
const BusquedaNoControlada = lazy(() => import('../pages/BusquedaNoControlada'));

const Inventario = lazy(() => import('../pages/Inventario'));
const NuevoInventario = lazy(() => import('../pages/NuevoInventario'));
const EditarInventario = lazy(() => import('../pages/EditarInventario'));

const Ventas = lazy(() => import('../pages/Ventas'));
const NuevaVenta = lazy(() => import('../pages/NuevaVenta'));

const Reportes = lazy(() => import('../pages/Reportes'));
const ReporteVentas = lazy(() => import('../pages/ReporteVentas'));
const ReporteProductos = lazy(() => import('../pages/ReporteProductos'));
const ReporteStockBajo = lazy(() => import('../pages/ReporteStockBajo'));

const NotFound = lazy(() => import('../pages/NotFound'));

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading mensaje="Cargando página..." />}>
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route
                        element={
                            <ProtectedRoute rolesPermitidos={['Administrador', 'Vendedor']}>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/ventas/nueva"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador', 'Vendedor']}>
                                    <NuevaVenta />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/productos"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Productos />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/productos/nuevo"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <NuevoProducto />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/productos/editar/:id"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <EditarProducto />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/productos/:id"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <DetalleProducto />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/productos-busqueda"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <BusquedaNoControlada />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/inventario"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Inventario />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/inventario/nuevo"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <NuevoInventario />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/inventario/editar/:id"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <EditarInventario />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/ventas"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Ventas />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/tallas"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                <Tallas />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/colores"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Colores />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/marcas"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Marcas />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/categorias"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Categorias />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/usuarios"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Usuarios />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/corte-caja"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <CorteCaja />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/reportes"
                            element={
                                <ProtectedRoute rolesPermitidos={['Administrador']}>
                                    <Reportes />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="ventas" element={<ReporteVentas />} />
                            <Route path="productos" element={<ReporteProductos />} />
                            <Route path="stock" element={<ReporteStockBajo />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;