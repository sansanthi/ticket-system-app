import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/Auth.context";
import { UserProvider } from "./context/User.context";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import SharedLayout from "./pages/SharedLayout";

function App() {
  return (
    //BrowserRouter is not working with github page deploy
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <UserProvider>
                  <SharedLayout />
                </UserProvider>
              </ProtectedRoutes>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
