import Home from "./pages/Home";
import SharedFile from "./pages/SharedFile";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthHandler } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthHandler>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/files/:id" element={<SharedFile />}></Route>
        </Routes>
      </AuthHandler>
    </BrowserRouter>
  );
}

export default App;
