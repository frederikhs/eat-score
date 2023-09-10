import knife_fork_plate from "../assets/knife_fork_plate.png";
import React, {useMemo} from "react";
import {NavLink} from "react-router-dom";
import {Account} from "../request";

interface Link {
    to: string
    name: React.ReactNode
}

export default function Navigation(props: { authed: boolean, account?: Account }) {
    const links = useMemo(() => {
        if (props.account === undefined) {
            return []
        }

        return [
            {to: "/", name: "All"},
            {to: "/venues", name: "Venues"},
            {to: "/me", name: props.account.account_name},
            {to: "/logout", name: <span className={"text-red-500"}>Logout</span>},
        ]
    }, [props.account]);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <NavLink to={props.authed ? "/" : "#"} className="flex items-center">
                    <img src={knife_fork_plate} className="h-8 mr-3" alt="Flowbite Logo"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Eat Score</span>
                </NavLink>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <div className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

                        {props.authed && links.map((link, index) => {
                            return (
                                <MenuLink key={index} link={link}/>
                            )
                        })}
                        {!props.authed && <MenuLink link={{to: "/login", name: "Login"}}/>}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function MenuLink(props: { link: Link }) {
    return (
        <NavLink
            className={({isActive}) => "block py-2 pl-3 pr-4 rounded " + (isActive ? "text-white bg-blue-700" : "text-gray-900 hover:bg-gray-100")}
            to={props.link.to}
        >{props.link.name}</NavLink>
    )
}