import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./auth/register/Register";
import Login from "./auth/login/Login";
import Home from "./home/Home";
import Menu from "./pages/menu/Menu";
import Question from "./pages/questions/Question";

function PrivateComp() {
  const auth = localStorage.getItem("users");
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateComp />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/audit" element={<Question />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
