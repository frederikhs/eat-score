import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import Navigation from "./pages/Navigation";
import Frame from "./components/Frame";
import {Account, AccountInfo} from "./request";
import Version from "./components/Version";

interface ContextType {
    account: Account
}

export function useAccount() {
    return useOutletContext<ContextType>();
}

export default function Root() {
    const navigate = useNavigate()
    const [account, setAccount] = useState<Account|undefined>(undefined);

    useEffect(() => {
        AccountInfo().then(r => {
            if (r.code !== 200) {
                navigate("/login")
            } else {
                setAccount(r.response)
            }
        })
    }, [navigate])

    return (
        <div>
            <Navigation authed={true} account={account}/>
            <Frame content={<Outlet context={{account}}/>}/>
            <Version />
        </div>
    );
}
