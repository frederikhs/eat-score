import React, {useEffect, useState} from 'react';
import {fetchAllItems, Item} from "../request";
import ReactSlider from "react-slider";

export default function Items() {
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        fetchAllItems().then((r) => {
            setItems(r.response)
        })
    }, [])

    if (items === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div>
            <table className="w-full text-left ">
                <thead className="uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Price (DKK)</th>
                    <th scope="col" className="px-6 py-3">Rating</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => {
                    return (
                        <tr key={index} className={"even:bg-gray-50 odd:bg-white hover:opacity-80 hover:cursor-pointer hover:text-blue-500"}>
                            <td className="px-6 py-4">{item.item_name}</td>
                            <td className="px-6 py-4">{item.item_price_dkk}</td>
                            <td className="px-6 py-4">
                                {item.avg_item_rating_value !== null &&
                                    <ReactSlider
                                        className="w-100 h-[50px] horizontal-slider"
                                        // marks
                                        markClassName="rating-mark h-[48px] w-[50px]"
                                        min={0}
                                        max={10}
                                        value={item.avg_item_rating_value}
                                        disabled={true}
                                        thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb"
                                        trackClassName="rating-track bg-gray-300 relative"
                                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                    />
                                }
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}
