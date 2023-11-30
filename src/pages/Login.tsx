import { userService } from "@/services/user.service";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/user/userSlice";
import { LoginInput, User, UserCred } from "@/types";
import { getErrorMessage, toastMsg } from "@/utils";

export const Login = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    try {
      ev.preventDefault();
      const formData = new FormData(ev.target as HTMLFormElement);
      const formProps = Object.fromEntries(formData) as LoginInput;
      const loginWith = formProps.identifyBy.includes("@")
        ? "email"
        : "username";
      const loginCreds = {
        [loginWith]: formProps.identifyBy,
        password: formProps.password,
      } as UserCred;
      console.log({loginCreds})
      const user = (await userService.login(loginCreds)) as User;
      dispatch(setUser(user));
      toastMsg("Logged in Successfully!");
    } catch (err) {
      const errMsg = getErrorMessage(err);
      toastMsg(errMsg, true);
    }
  };

  return (
    <div className="login-main-container">
      <form className="login-form-container" onSubmit={handleSubmit}>
        <header className="login-header">Login</header>
        <div className="login-inputs-container">
          <input
            type="text"
            name="identifyBy"
            placeholder="Email or Username*"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password*"
            required
          />
        </div>
        <button className="login-btn">LOGIN</button>
        <div className="links-container">
          <a href="/forgot-password">Forgot password?</a>
          <a href="/register">Don't have an account? Sign Up</a>
        </div>
      </form>
      <footer className="login-footer-container">
        <h1>Join a party. Be a Dj. Or just listen.</h1>
      </footer>
    </div>
  );
};
