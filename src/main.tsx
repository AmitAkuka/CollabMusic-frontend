import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store.config";
import { Provider } from "react-redux";

import "./assets/styles/main.scss";

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
