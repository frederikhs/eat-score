import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import MagicLogin from "./pages/MagicLogin";
import Me from "./pages/Me";
import Login from "./pages/Login";
import Root from "./Root";
import Index from "./pages/Index";
import LogoutPage from "./pages/Logout";
import Items from "./pages/Items";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: "/",
                element: <Items/>,
            },
            {
                path: "/me",
                element: <Me/>,
            },
            {
                path: "/logout",
                element: <LogoutPage/>,
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/magic-login",
        element: <MagicLogin/>,
    },
    {
        path: '*',
        element: <Navigate replace to="/"/>
    }
]);

root.render(
    // <React.StrictMode>
    <RouterProvider router={router}/>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
