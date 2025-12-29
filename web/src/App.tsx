import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./pages/DashboardLayout";
import OrderDashboard from "./pages/OrderDashboard";
import InventoryPage from "./pages/InventoryPage";
import PaymentsPage from "./pages/PaymentsPage";
import ShippingPage from "./pages/ShippingPage";
import NotificationsPage from "./pages/NotificationsPage";
import LogsPage from "./pages/LogsPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/orders" element={<DashboardLayout />}>
                <Route index element={<OrderDashboard />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="shipping" element={<ShippingPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="logs" element={<LogsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
