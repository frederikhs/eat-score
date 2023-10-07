import React from 'react';
import {useAccount} from "../Root";
import {FaArrowRightFromBracket} from "react-icons/fa6";
import {Link} from "react-router-dom";

export default function Me() {
    const {account} = useAccount()

    if (account === undefined) {
        return null
    }

    return (
        <div>
            <div className={"flex justify-center dark:text-white"}>
                <div className={"text-center"}>
                    <h1 className={"heading-default"}>Hello {account.account_name}</h1>
                    <p>{"<"}{account.account_email}{">"}</p>
                    <Link
                        to={"/logout"}
                        className={"inline-block text-white font-bold py-2 px-4 mt-4 rounded text-red-600 hover:underline"}
                    >
                        <div className={"flex items-center justify-center space-x-3"}>
                            <span>Logout</span>
                            <FaArrowRightFromBracket/>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    );
}
