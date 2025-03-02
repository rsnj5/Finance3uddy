import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use 'react-dom/client'
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import App from "./App";
import store from "./redux/store";

const clientId = "940895645086-tilkon9sgpdqus8ir04jf1be321dfubd.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={clientId}> 
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
