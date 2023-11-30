import { AppLoader } from "@/cmps/AppLoader";
import { userService } from "@/services/user.service";
import { getErrorMessage, toastMsg } from "@/utils";
import { useState } from "react";

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    try {
      ev.preventDefault();
      setIsLoading(true);
      const formData = new FormData(ev.target as HTMLFormElement);
      const email = formData.get("email") as String;
      const emailRes = await userService.getForgotPasswordLink(email);
      toastMsg(emailRes);
      setIsLoading(false);
    } catch (err) {
      const errMsg = getErrorMessage(err);
      toastMsg(errMsg, true);
      setIsLoading(false);
    }
  };

  return (
    <section className="forgot-password-main-container">
      {isLoading && <AppLoader />}
      <form className="forgot-password-form-container" onSubmit={handleSubmit}>
        <header className="forgot-password-header">Forgot Password</header>
        <div className="forgot-password-inputs-container">
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address..."
          />
        </div>
        <button className="forgot-password-btn">SUBMIT</button>
        <div className="links-container">
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
      <footer className="forgot-password-footer-container">
        <h1>Join a party. Be a Dj. Or just listen.</h1>
      </footer>
    </section>
  );
};
