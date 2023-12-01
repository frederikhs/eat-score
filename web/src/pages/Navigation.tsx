import knife_fork_plate from "../assets/knife_fork_plate.png";
import React, {useMemo} from "react";
import {NavLink} from "react-router-dom";
import {Account} from "../request";
import {FaBurger, FaShop} from "react-icons/fa6";
import {FaKey, FaUser, FaUsers} from "react-icons/fa";
import {firstWord} from "../util";

interface Link {
    to: string
    name: string
    icon: React.ReactNode
}

export default function Navigation(props: { authed: boolean, account?: Account }) {
    const links = useMemo(() => {
        if (props.account === undefined) {
            return []
        }

        return [
            {to: "/", name: "Items", icon: <FaBurger/>},
            {to: "/venues", name: "Venues", icon: <FaShop/>},
            {to: "/users", name: "Users", icon: <FaUsers/>},
            {to: "/me", name: firstWord(props.account.account_name), icon: <FaUser/>},
        ]
    }, [props.account]);

    return (
        <nav className="bg-white dark:bg-neutral-900 border-gray-200 sticky top-0 z-10 shadow-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto sm:p-4 p-2">
                <NavLink to={props.authed ? "/" : "#"} className="flex items-center">
                    <img src={knife_fork_plate} className="h-8 mr-3" alt="Eat Score Logo"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:underline">Eat Score</span>
                </NavLink>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <div className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white dark:bg-neutral-900">
                        {props.authed && links.map((link, index) => {
                            return (
                                <MenuLink key={index} link={link} show_title={true}/>
                            )
                        })}
                        {!props.authed && <MenuLink link={{to: "/login", name: "Login", icon: <FaKey/>}} show_title={true}/>}
                    </div>
                </div>
                <div className="md:hidden" id="navbar-default">
                    <div className="flex sm:p-4 p-2 sm:space-x-2 space-x-1 rounded-lg bg-white dark:bg-neutral-900">
                        {props.authed && links.map((link, index) => {
                            return (
                                <MenuLink key={index} link={link} show_title={false}/>
                            )
                        })}
                        {!props.authed && <MenuLink link={{to: "/login", name: "Login", icon: <FaKey/>}} show_title={true}/>}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function MenuLink(props: { link: Link, show_title: boolean }) {
    return (
        <NavLink
            className={({isActive}) => "block py-2 px-3 rounded " + (isActive ? "bg-mango-600 text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-500")}
            to={props.link.to}
        >
            <div className={"flex items-center space-x-3"}>
                {props.link.icon}
                {props.show_title && <span>{props.link.name}</span>}
            </div>
        </NavLink>
    )
}
