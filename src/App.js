import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import './style.scss';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./cotext/AuthContext";
import { AdminPage } from "./pages/AdminPage";
import IsAdmin from './components/IsAdmin';
import { Page404 } from "./pages/page404";
import { NotAnAdmin } from "./pages/NotAnAdminPage";
import { UpdateProfilePage } from "./pages/UpdateProfilePage";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {IsAdmin(currentUser?.uid) && <Route path="admin" element={<AdminPage />} />}
          {IsAdmin(currentUser?.uid) || <Route path="admin" element={<NotAnAdmin />} />}
          <Route path="updateProfile" element={<UpdateProfilePage/>} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
