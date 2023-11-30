import { AppSidebar } from "@/cmps/AppSiderbar";
import { useAppSelector } from "@/store/hooks";
import { Outlet } from "react-router-dom";

export const Home = () => {
  const loggedUser = useAppSelector((state) => state.userModule.user);

  return (
    <section className="main-home-container">
      <AppSidebar loggedUser={loggedUser} />
      <Outlet />
    </section>
  );
};
