import { NavLink } from "react-router-dom";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { User } from "@/types";
import { userService } from "@/services/user.service";
import { setUser } from "@/store/user/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { toastMsg } from "@/utils";
import { useMemo } from "react";
import AppLogo from "@/assets/img/app-logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

type Props = {
  loggedUser: User | null;
};

export const AppSidebar = ({ loggedUser }: Props) => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await userService.logout();
    dispatch(setUser(null));
    toastMsg("Logged out Successfully!");
  };

  const sidebarBtns = useMemo(() => {
    return [
      { path: "/", label: "Music Room", icon: <MusicNoteIcon /> },
      { path: "/shop", label: "Avatars shop", icon: <ShoppingCartIcon /> },
    ];
  }, []);

  return (
    <aside className="sidebar-main-container">
      <header className="sidebar-header-container">
        <img src={AppLogo} alt="app-logo" />
        <h1>
          Collab<span>Music</span>
        </h1>
      </header>
      <main className="sidebar-btns-container">
        {sidebarBtns.map((btn) => {
          const { path, label, icon } = btn;
          return (
            <NavLink key={path + label} to={path}>
              {icon}
              {label}
            </NavLink>
          );
        })}
      </main>
      <footer className="siderbar-footer-container">
        {loggedUser && (
          <>
            <p>
              Welcome back,
              <br /> {loggedUser.username}
            </p>
            <LogoutIcon onClick={() => handleLogout()} />
          </>
        )}
      </footer>
    </aside>
  );
};
