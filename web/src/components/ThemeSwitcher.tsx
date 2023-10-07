import React, {useEffect, useState} from "react";
import {FaMoon, FaSun} from "react-icons/fa";

export default function ThemeSwitcher() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.darkMode === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="py-2 px-3 rounded text-black dark:text-white bg-gray-100 dark:bg-neutral-500 hover:bg-gray-200 dark:hover:bg-neutral-600"
        >
            <div className={"flex items-center justify-center space-x-3"}>
                <span>Switch to </span>
                {darkMode ? <FaSun/> : <FaMoon/>}
                <span>mode</span>
            </div>
        </button>
    );
};
