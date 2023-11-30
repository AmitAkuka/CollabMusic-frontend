import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from "./routes";
import { ComponentRoute } from "./types/index";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { selectUser } from "./store/user/userSlice";

function App() {
  const toastOpts: ToastContainerProps = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: true,
    theme: "dark",
    style: { zIndex: 50000 },
  };

  const loggedUser = useAppSelector(selectUser);

  return (
    <div className="App">
      <Routes>
        {routes.map((route: ComponentRoute, idx: number) => (
          <Route
            key={idx}
            path={route.path}
            element={
              //Prevent user from reaching protected routes.
              route.auth && !loggedUser ? (
                <Navigate to="/login" replace />
              ) : loggedUser &&
                //Prevent logged user from reaching login and register.
                (route.path === "/register" || route.path === "/login") ? (
                <Navigate to="/" replace />
              ) : (
                <route.component />
              )
            }
          >
            {route?.children &&
              route.children.map((child) => (
                <Route
                  key={child.path || "default"}
                  index={child.index}
                  path={child.path}
                  element={<child.component />}
                />
              ))}
          </Route>
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />{" "}
        {/* Prevent from accessing undefined routes */}
      </Routes>
      <ToastContainer {...toastOpts} />
    </div>
  );
}

export default App;
