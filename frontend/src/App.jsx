import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./pages/auth/LoginScreen";
import SelectDoctor from "./pages/patient/SelectDoctor";
import Layout from "./components/Layout/Layout";
// import ScheduleAppointment from './pages/patient/ScheduleAppointment';
import DashboardScreen from './pages/admin/DashboardScreen';
import MyAppointmentsPage from "./pages/patient/MyAppointmentsPage";
import MyProfilePage from "./pages/patient/MyProfilePage";
// import ManageUsersScreen from './pages/admin/ManageUsersScreen';
import AdminRoute from './components/Auth/AdminRoute';
import { AuthProvider } from './hooks/auth/useAuth';
import ForgotPasswordScreen from "./pages/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/auth/ResetPasswordScreen";
import RegisterScreen from "./pages/auth/RegisterScreen";
import MonthlyDateSelection from "./pages/patient/MonthlyDateSelection";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import BrandingPage from "./pages/admin/BrandingPage";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        {/* Rotas que não usam o Layout ficam aqui fora */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                        <Route path="/reset-password" element={<ResetPasswordScreen />} />
                        <Route path="/register" element={<RegisterScreen />} />


                        {/* Parent route that renders Layout; children render inside the Outlet */}
                        <Route element={<Layout />}>
                            <Route path="/buscar-medico" element={<SelectDoctor />} />
                            <Route path="/meu-perfil" element={<MyProfilePage />} />
                            <Route path="/minhas-consultas" element={<MyAppointmentsPage />} />
                            <Route path="/agendar/:id" element={<MonthlyDateSelection />} />
                        </Route>

                        {/* Admin-only routes */}
                        <Route element={<AdminRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/admin/dashboard" element={<DashboardScreen />} />
                                <Route path="/admin/branding" element={<BrandingPage />} />
                                {/* <Route path="/admin/manage-users" element={<ManageUsersScreen />} /> */}
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>

                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}
