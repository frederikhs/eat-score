import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import MagicLogin from "./pages/MagicLogin";
import Me from "./pages/Me";
import Login from "./pages/Login";
import Root from "./Root";
import LogoutPage from "./pages/Logout";
import Items from "./pages/Items";
import ListVenuesPage from "./pages/ListVenuesPage";
import ShowVenuePage from "./pages/ShowVenuePage";
import ShowItemPage from "./pages/ShowItemPage";

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
                path: "/venues",
                element: <ListVenuesPage/>,
            },
            {
                path: "/venues/:venue_id",
                element: <ShowVenuePage/>,
            },
            {
                path: "/venues/:venue_id/items/:item_id",
                element: <ShowItemPage/>,
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

if (localStorage.darkMode === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

root.render(
    // <React.StrictMode>
    <RouterProvider router={router}/>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
