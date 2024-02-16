import React, {useEffect, useState} from "react";
import {FaMoon, FaSun} from "react-icons/fa";

export default function ThemeSwitcher() {
    const [darkMode, setDarkMode] = useState(localStorage.darkMode === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

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
            className="font-bold py-2 rounded text-black dark:text-white hover:underline"
        >
            <div className={"flex items-center justify-center space-x-3"}>
                <span>Switch to </span>
                {darkMode ? <FaSun/> : <FaMoon/>}
                <span>mode</span>
            </div>
        </button>
    );
};
