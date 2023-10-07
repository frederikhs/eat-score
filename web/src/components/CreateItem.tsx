import React, {useMemo, useState} from "react";
import {createItem} from "../request";
import {FaPlus} from "react-icons/fa";

export default function CreateItem(props: { venue_id: number, onSubmit: (item_id: number) => void }) {
    const [itemName, setItemName] = useState("");
    const [itemPriceDKK, setItemPriceDKK] = useState("");

    const submit = () => {
        createItem(props.venue_id, itemName, parseInt(itemPriceDKK)).then(r => {
            if (r.code === 201) {
                props.onSubmit(r.response.item_id)
            }
        })
    }

    const canSubmit = useMemo(() => {
        return itemName.length >= 3 && parseInt(itemPriceDKK) > -1
    }, [itemName, itemPriceDKK]);

    return (
        <div className={"flex space-x-2"}>
            <input
                value={itemName}
                name={"item_name"}
                placeholder={"Durum Menu"}
                autoComplete={"off"}
                onChange={e => setItemName(e.target.value)}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-600 dark:border-neutral-700 dark:text-white"
                type="text"
            />
            <input
                value={itemPriceDKK}
                name={"item_price"}
                placeholder={"75"}
                autoComplete={"off"}
                onChange={e => setItemPriceDKK(e.target.value)}
                className="appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-600 dark:border-neutral-700 dark:text-white"
                type="number"
            />
            <button
                disabled={!canSubmit}
                onClick={() => submit()}
                className={"w-full text-white font-bold py-2 px-4 rounded " + (canSubmit ? "bg-mango-600 hover:bg-mango-700" : "bg-gray-300 dark:bg-neutral-500 hover:cursor-not-allowed")}
            >
                <div className={"flex items-center justify-center space-x-3"}>
                    <span>Create item</span>
                    <FaPlus/>
                </div>
            </button>
        </div>
    )
}
