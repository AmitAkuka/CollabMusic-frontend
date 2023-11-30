import { userService } from "@/services/user.service";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkInputValidation, getErrorMessage, toastMsg } from "@/utils";
import { AppLoader } from "@/cmps/AppLoader";

export const ResetPasword = () => {
  const [isVerificationPassed, setIsVerificationPassed] = useState(false);
  const { id, token } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!id || !token) return navigate("/login");
    const verifyForgotPasswordLink = async () => {
      try {
        const decodedUserId = atob(id);
        const decodedToken = atob(token);
        const isVerified = await userService.verifyLink(
          decodedUserId,
          decodedToken
        );
        if (!isVerified) throw new Error("Token is not verified");
        toastMsg("Link verified");
        setIsVerificationPassed(true);
      } catch (err) {
        const errMsg = getErrorMessage(err);
        toastMsg(errMsg, true);
        return navigate("/login");
      }
    };
    verifyForgotPasswordLink();
  }, []);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    try {
      ev.preventDefault();
      if (!id) return;
      const decodedUserId = atob(id);
      const formData = new FormData(ev.target as HTMLFormElement);
      const formProps = Object.fromEntries(formData);
      const isValidate = checkInputValidation(formProps);
      if (isValidate) {
        const { password } = formProps;
        const res = await userService.updatePassword(
          decodedUserId,
          password as String
        );
        toastMsg(res);
        navigate("/login");
      }
    } catch (err) {
      const errMsg = getErrorMessage(err);
      toastMsg(errMsg, true);
    }
  };

  return (
    <section className="reset-password-main-container">
      {!isVerificationPassed && <AppLoader />}
      {isVerificationPassed && (
        <>
          <form
            className="reset-password-form-container"
            onSubmit={handleSubmit}
          >
            <header className="reset-password-header">Reset Password</header>
            <div className="reset-password-inputs-container">
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
            <button className="reset-password-btn">SUBMIT</button>
          </form>
          <footer className="reset-password-footer-container">
            <h1>Join a party. Be a Dj. Or just listen.</h1>
          </footer>
        </>
      )}
    </section>
  );
};
