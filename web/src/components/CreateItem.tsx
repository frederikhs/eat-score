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
        <div>
            <div className={"mb-2"}>
                <h5 className="heading-default">Create new item</h5>
            </div>
            <div className={"flex items-end space-x-2"}>
                <div className={"grow"}>
                    <label htmlFor="item_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input
                        value={itemName}
                        name={"item_name"}
                        placeholder={"Durum Menu"}
                        autoComplete={"off"}
                        onChange={e => setItemName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-500"
                        type="text"
                        required/>
                </div>
                <div>
                    <label htmlFor="item_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price (DKK). 0 DKK if free</label>
                    <input
                        value={itemPriceDKK}
                        name={"item_price"}
                        placeholder={"75"}
                        autoComplete={"off"}
                        onChange={e => setItemPriceDKK(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-500"
                        type="number"
                        required/>
                </div>
                <button
                    disabled={!canSubmit}
                    onClick={() => submit()}
                    className={"text-white font-bold py-2 px-4 rounded " + (canSubmit ? "bg-mango-600 hover:bg-mango-700" : "bg-gray-300 dark:bg-neutral-500 hover:cursor-not-allowed")}
                >
                    <div className={"flex items-center justify-center space-x-3"}>
                        <span>Create</span>
                        <FaPlus/>
                    </div>
                </button>
            </div>
        </div>
    )
}
