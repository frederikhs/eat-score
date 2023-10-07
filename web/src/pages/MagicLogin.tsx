import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {loginWithMagicLoginLink} from "../request";
import Navigation from "./Navigation";
import Frame from "../components/Frame";

export default function MagicLogin() {
    const [searchParams, _] = useSearchParams()
    const magicLoginLinkHash = searchParams.get('magic_login_link_hash')
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState<boolean>(false);
    const [loginErrorReason, setLoginErrorReason] = useState<string>("");

    useEffect(() => {
        loginWithMagicLoginLink(magicLoginLinkHash as string).then(r => {
            if (r.code === 201) {
                navigate("/")
            } else {
                setLoginError(true)
                setLoginErrorReason(r.response.message)
            }
        })
    }, [magicLoginLinkHash, navigate])

    return (
        <div>
            <Navigation authed={false}/>
            <Frame
                content={
                    <div className={"text-center"}>
                        {!loginError && <p>Logging you in...</p>}
                        {loginError && <p>Could not log you in<br/><span className={"italic"}>{loginErrorReason}</span></p>}
                    </div>
                }
            />
        </div>
    )
}
