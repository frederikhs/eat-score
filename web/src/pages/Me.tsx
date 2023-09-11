import React from 'react';
import {useAccount} from "../Root";

export default function Me() {
    const {account} = useAccount()

    return (
        <div>
            <h1 className={"heading-default"}>Hello {account.account_name} {"<"}{account.account_email}{">"}</h1>
        </div>
    );
}
