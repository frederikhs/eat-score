import React from 'react';
import {useAccount} from "../Root";

export default function Me() {
    const {account} = useAccount()

    if (account === undefined) {
        return null
    }

    return (
        <div className={"flex justify-center dark:text-white"}>
            <div className={"text-center"}>
                <h1 className={"heading-default"}>Hello {account.account_name}</h1>
                <p>{"<"}{account.account_email}{">"}</p>
            </div>
        </div>
    );
}
