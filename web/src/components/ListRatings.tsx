import {createItemRating, ItemRating} from "../request";
import React from "react";
import Moment from "react-moment";
import InfoBadge from "./InfoBadge";
import {FaClock} from "react-icons/fa";
import RateSlider from "./RateSlider";
import {firstWord} from "../util";

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
            <tbody>
            {props.item_ratings.map((item_rating, index) => {
                return (
                    <tr key={index} className={"odd:bg-gray-100 dark:even:bg-neutral-800 even:bg-white dark:odd:bg-neutral-700"}>
                        <td className="px-3 py-2">
                            <div className={"flex items-center space-x-2"}>
                                <span className={"sm:hidden"}>{firstWord(item_rating.item_rating_account_name)}</span>
                                <span className={"hidden sm:block"}>{item_rating.item_rating_account_name}</span>
                                <div className={"hidden sm:flex"}>
                                    <InfoBadge
                                        icon={<FaClock/>}
                                        title={<span><Moment date={item_rating.item_rating_created_at} fromNow/></span>}
                                        hide={false}
                                    />
                                    {item_rating.item_rating_account_id === props.account_id && (
                                        <button
                                            onClick={() => deleteItemRating(item_rating)}
                                            className={"text-red-600 hover:underline"}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td className="px-3 py-2">
                            <RateSlider value={item_rating.item_rating_value} hideValue={false} disabled={true}/>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
