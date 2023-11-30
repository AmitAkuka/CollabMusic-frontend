import loader from "@/assets/img/loader.gif";

export const AppLoader = () => {
  return (
    <section className="app-loader-container">
      <img src={loader} alt="app-loader" />
    </section>
  );
};
