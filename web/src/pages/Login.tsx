import React, {useEffect, useMemo, useState} from 'react';
import {AccountInfo, requestMagicLoginLink} from "../request";
import Frame from "../components/Frame";
import Navigation from "./Navigation";
import isEmail from 'validator/lib/isEmail';
import {useNavigate} from "react-router-dom";
import {FaInbox, FaSpinner} from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState<string | null>(null);
    const [hasSentMail, setHasSentMail] = useState<boolean>(false);
    const [hasCheckedLogin, setHasCheckedLogin] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        AccountInfo().then(r => {
            if (r.code === 200) {
                navigate("/")
            }

            setHasCheckedLogin(true)
        })
    }, [])

    const submit = () => {
        setLoading(true)
        requestMagicLoginLink(email).then(r => {
            setReason(r.response.message)
            if (r.code === 201) {
                setHasSentMail(true)
            }
            setLoading(false)
        })
    }

    const canSubmit = useMemo(() => {
        if (loading) {
            return false
        }
        return isEmail(email)
    }, [email, loading]);

    return (
        <div>
            <Navigation authed={false}/>
            <Frame
                content={
                    <div className={"flex justify-center align-items dark:text-white"}>
                        {!hasCheckedLogin && <p className={"text-center"}>Loading</p>}

                        {hasCheckedLogin && !hasSentMail && <div>
                            <h3 className={"text-center text-xl mb-6"}>Login using your email</h3>
                            <input
                                value={email}
                                name={"email"}
                                placeholder={"john@appleseed.com"}
                                onChange={e => setEmail(e.target.value)}
                                className="text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-600 dark:border-neutral-700 dark:text-white"
                                type="text"
                            />


                            <button
                                disabled={!canSubmit}
                                onClick={() => submit()}
                                className={"w-full text-white text-center font-bold py-2 px-4 rounded " + (canSubmit ? "bg-mango-600 hover:bg-mango-700" : "bg-gray-300 dark:bg-gray-400 hover:cursor-not-allowed")}
                            >
                                {loading &&
                                    <span className={"flex justify-center"}><FaSpinner className={"animate-spin text-2xl flex justify-center"}/></span>}
                                {!loading && <span>Request magic link</span>}
                            </button>
                            {reason !== null && <p className={"text-center"}>{reason}</p>}
                        </div>
                        }
                        {hasCheckedLogin && hasSentMail && <div className={"text-center"}>
                            <div className={"flex justify-center"}>
                                <FaInbox className={"text-6xl text-green-600"}/>
                            </div>
                            <h1 className={"heading-default !text-green-600"}>Success, check your inbox </h1>
                            <p>A magic login link has been sent to {"<"}{email}{">"}</p>
                        </div>
                        }
                    </div>
                }
            />
        </div>
    );
}
