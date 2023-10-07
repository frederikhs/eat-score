import {createItemRating, ItemRating} from "../request";
import ReactSlider from "react-slider";
import React from "react";
import Moment from "react-moment";
import InfoBadge from "./InfoBadge";
import {FaClock} from "react-icons/fa";

export default function ListRatings(props: { item_ratings: ItemRating[], account_id: number, onDelete: () => void }) {
    const deleteItemRating = (itemRating: ItemRating) => {
        createItemRating(itemRating.venue_id, itemRating.item_id, -1).then(r => {
            if (r.code === 201) {
                props.onDelete()
            }
        })
    }

    return (
        <table className="w-full text-left dark:text-white table-fixed">
            <thead className="uppercase bg-gray-50 dark:bg-neutral-800">
            <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">Rating</th>
            </tr>
            </thead>
            <tbody>
            {props.item_ratings.map((item_rating, index) => {
                return (
                    <tr key={index} className={"even:bg-gray-50 dark:even:bg-neutral-800 odd:bg-white dark:odd:bg-neutral-700"}>
                        <td className="px-6 py-4">
                            <div className={"flex items-center space-x-2"}>
                                <span>{item_rating.item_rating_account_name}</span>
                                <span className={"hidden sm:block"}>
                                    <InfoBadge icon={<FaClock/>} title={<span><Moment date={item_rating.item_rating_created_at} fromNow/></span>} hide={false}/>
                                </span>
                            </div>
                        </td>
                        <td>
                            {item_rating.item_rating_account_id === props.account_id && (
                                <button
                                    onClick={() => deleteItemRating(item_rating)}
                                    className={"py-2 pl-3 pr-4 rounded text-red-600 hover:underline"}
                                >
                                    Delete
                                </button>
                            )}
                        </td>
                        <td className="px-6 py-4 flex">
                            <ReactSlider
                                className="w-full h-[50px] horizontal-slider"
                                markClassName="rating-mark h-[48px] w-[50px]"
                                min={0}
                                max={10}
                                value={item_rating.item_rating_value}
                                disabled={true}
                                thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb"
                                trackClassName="rating-track bg-gray-300 dark:bg-neutral-600 relative"
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
