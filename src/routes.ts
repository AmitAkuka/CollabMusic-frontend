import { AppWorkspace } from "./cmps/AppWorkspace";
import { AvatarsShop } from "./cmps/AvatarsShop";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ResetPasword } from "./pages/ResetPassword";

export const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        index: true,
        component: AppWorkspace,
      },
      {
        index: false,
        path: "/shop",
        component: AvatarsShop,
      },
    ],
    auth: true,
  },
  {
    path: "/login",
    component: Login,
    auth: false,
  },
  {
    path: "/register",
    component: Register,
    auth: false,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    auth: false,
  },
  {
    path: "/reset-password/:id/:token",
    component: ResetPasword,
    auth: false,
  },
];
