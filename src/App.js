import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/Auth.context";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    //BrowserRouter is not working with github page deploy
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          ></Route>
          <Route path="login" element={<Login />}></Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
