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
        <tr className={"even:bg-gray-50 odd:bg-white hover:opacity-80 hover:cursor-pointer hover:text-blue-500"}>
            <td className="px-3 py-2">
                <input
                    value={itemName}
                    name={"item_name"}
                    placeholder={"Durum Menu"}
                    autoComplete={"off"}
                    onChange={e => setItemName(e.target.value)}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                />
            </td>
            <td className="px-3 py-2">
                <input
                    value={itemPriceDKK}
                    name={"item_price"}
                    placeholder={"75"}
                    autoComplete={"off"}
                    onChange={e => setItemPriceDKK(e.target.value)}
                    className="appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                />
            </td>
            <td className="px-3 py-2">
                <button
                    disabled={!canSubmit}
                    onClick={() => submit()}
                    className={"w-full text-white font-bold py-2 px-4 rounded " + (canSubmit ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-200 hover:cursor-not-allowed")}
                >
                    <div className={"flex items-center justify-center space-x-3"}>
                        <span>Create item</span>
                        <FaPlus />
                    </div>
                </button>
            </td>
        </tr>
    )
}
