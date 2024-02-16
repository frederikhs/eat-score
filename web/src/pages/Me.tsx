import React, {useState} from 'react';
import {useAccount} from "../Root";
import {FaArrowRightFromBracket} from "react-icons/fa6";
import {Link} from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import {logoutOther} from "../request";
import {FaCheck} from "react-icons/fa";
import {firstWord} from "../util";

export default function Me() {
    const {account} = useAccount()
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const logOutOtherSessions = () => {
        setLoading(true)
        logoutOther()
            .then(r => {
                setSuccess(r.code == 200)
            })
            .catch(() => {
                setSuccess(false)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    if (account === undefined) {
        return null
    }

    return (
        <div className={"box dark:text-white"}>
            <div className={""}>
                <h1 className={"heading-default"}>Hi {firstWord(account.account_name)}</h1>
                <p>Logged in with {"<"}{account.account_email}{">"}</p>
            </div>

            <div className={"flex justify-start mt-4 space-x-8"}>
                <ThemeSwitcher/>

                <Link
                    to={"/logout"}
                    className={"inline-block font-bold py-2 rounded text-red-600 hover:underline"}
                >
                    <div className={"flex items-center justify-center space-x-3"}>
                        <span>Logout this session</span>
                        <FaArrowRightFromBracket/>
                    </div>
                </Link>

                {!success &&
                    <button
                        onClick={() => logOutOtherSessions()}
                        disabled={loading}
                        className={"font-bold py-2 rounded text-red-600 hover:underline"}
                    >
                        <div className={"flex items-center justify-center space-x-3"}>
                            <span>Logout all other sessions</span>
                            <FaArrowRightFromBracket/>
                        </div>
                    </button>
                }
                {success &&
                    <div className={"inline-block"}>
                        <div className={"flex items-center justify-center space-x-3 py-2 text-green-600 font-bold"}>
                            <span>Successfully logged out of all other sessions</span>
                            <FaCheck/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
