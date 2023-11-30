import { userService } from "@/services/user.service";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/user/userSlice";
import { UserCred } from "@/types";
import { getErrorMessage, toastMsg, checkInputValidation } from "@/utils";

export const Register = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    try {
      ev.preventDefault();
      const formData = new FormData(ev.target as HTMLFormElement);
      const formProps = Object.fromEntries(formData);
      const isValidate = checkInputValidation(formProps);
      if (isValidate) {
        delete formProps.repeatPassword;
        const user = await userService.signup(formProps as UserCred);
        dispatch(setUser(user));
        toastMsg("Logged in Successfully!");
      }
    } catch (err) {
      const errMsg = getErrorMessage(err);
      toastMsg(errMsg, true);
    }
  };

  return (
    <div className="register-main-container">
      <form className="register-form-container" onSubmit={handleSubmit}>
        <header className="register-header">Register</header>
        <div className="register-inputs-container">
          <input type="text" name="username" placeholder="Username*" required />
          <input
            type="email"
            name="email"
            placeholder="Email Adress*"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password*"
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password*"
            required
          />
        </div>
        <button className="register-btn">SUBMIT</button>
        <div className="links-container">
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
      <footer className="register-footer-container">
        <h1>Register to the party. Be a Dj. Or just listen.</h1>
      </footer>
    </div>
  );
};
