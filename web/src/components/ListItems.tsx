import {Item} from "../request";
import ReactSlider from "react-slider";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function ListItems(props: { items: Item[], show_venue: boolean }) {
    const navigate = useNavigate()

    return (
        <table className="w-full text-left ">
            <thead className="uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                {props.show_venue && <th scope="col" className="px-6 py-3">Venue</th>}
                <th scope="col" className="px-6 py-3">Price (DKK)</th>
                <th scope="col" className="px-6 py-3">Rating</th>
            </tr>
            </thead>
            <tbody>
            {props.items.map((item, index) => {
                return (
                    <tr
                        onClick={() => navigate(`/venues/${item.venue_id}/items/${item.item_id}`)}
                        key={index}
                        className={"even:bg-gray-50 odd:bg-white hover:opacity-80 hover:cursor-pointer hover:text-blue-500"}
                    >
                        <td className="px-6 py-4">
                            {item.item_name}
                        </td>
                        {props.show_venue && <td className="px-6 py-4">{item.venue_name}</td>}
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
                            {item.avg_item_rating_value === null && <span className={"flex justify-center"}>No ratings yet</span>}
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
