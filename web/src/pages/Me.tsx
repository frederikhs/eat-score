import React, {useMemo} from 'react';
import {useAccount} from "../Root";

export default function Me() {
    const {account} = useAccount()

    const accountString = useMemo(() => {
        return JSON.stringify(account)
    }, [account]);

    return (
        <pre>{accountString}</pre>
    );
}
