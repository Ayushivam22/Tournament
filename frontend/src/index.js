import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import TeamDetails from "./TeamDetails";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.async = true;
document.body.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/teams" element={<TeamDetails />} />
        <Route path="*" element={<div>You Are On Wrong Page</div>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
