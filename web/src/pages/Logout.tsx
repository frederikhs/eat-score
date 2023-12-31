import React, {useEffect} from 'react';
import {logout} from "../request";
import {useNavigate} from "react-router-dom";

export default function LogoutPage() {
    const navigate = useNavigate()

    useEffect(() => {
        logout().then(r => {
            if (r.code === 200) {
                navigate("/login")
            }
        })
    })

    return (
        <h1 className={"heading-default text-center"}>Logging you out...</h1>
    )
}
