import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Vocabulary from "./pages/Vocabulary";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtecdedRoute";
import { isAuthenticated } from "./api/authServices";

// Empêche un utilisateur déjà connecté de revoir login/register
function PublicOnly({ children }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Attrape toutes les URL inconnues */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;