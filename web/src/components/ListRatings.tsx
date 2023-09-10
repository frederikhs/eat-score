import {ItemRating} from "../request";
import ReactSlider from "react-slider";
import React from "react";

export default function ListRatings(props: { item_ratings: ItemRating[] }) {
    return (
        <table className="w-full text-left ">
            <thead className="uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">Account Name</th>
                <th scope="col" className="px-6 py-3">Rating</th>
            </tr>
            </thead>
            <tbody>
            {props.item_ratings.map((item_rating, index) => {
                return (
                    <tr key={index} className={"even:bg-gray-50 odd:bg-white hover:opacity-80 hover:cursor-pointer hover:text-blue-500"}>
                        <td className="px-6 py-4">{item_rating.account_name}</td>
                        <td className="px-6 py-4">
                            <ReactSlider
                                className="w-100 h-[50px] horizontal-slider"
                                // marks
                                markClassName="rating-mark h-[48px] w-[50px]"
                                min={0}
                                max={10}
                                value={item_rating.item_rating_value}
                                disabled={true}
                                thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb"
                                trackClassName="rating-track bg-gray-300 relative"
                                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                            />
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
