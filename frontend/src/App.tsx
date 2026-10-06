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
import RestaurantPage from "./pages/RestaurantPage";
import Cart from "./pages/Cart";
import AddAddressPage from "./pages/Address";
import Checkout from "./pages/Checkout";

const App = () => {
  const { user } = useAppData();

  if (user && user.role === "seller") {
    return <Restaurant />
  }

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
            <Route path="/address" element={<AddAddressPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
