import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/protectedRoute";
import PublicRoute from "./components/publicRoute";
import SelectRole from "./pages/SelectRole";
import NavBar from "./components/navbar";
import Account from "./pages/Account";
import { useAppData } from "./context/AppContext";
import Restaurant from "./pages/Restaurant";

const App = () => {
  const { user } = useAppData();

  return (
    <>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/restaurant"
              element={user?.role === "seller" ? <Restaurant /> : <Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
