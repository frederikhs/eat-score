import {Venue} from "../request";
import ReactSlider from "react-slider";
import React from "react";
import {Link} from "react-router-dom";

export default function ListVenue(props: { venue: Venue }) {
    return (
        <div className="rounded overflow-hidden shadow-md dark:text-white dark:bg-neutral-800">
            <Link to={"/venues/" + props.venue.venue_id}>
                <div className="px-6 py-4">
                    <div className={"flex justify-between items-center mb-2"}>
                        <div className="font-bold text-xl ">{props.venue.venue_name}</div>
                        <p className={"text-black/25 dark:text-white/25 text-xs"}>Created by {props.venue.venue_created_by_account_name}</p>
                    </div>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <ReactSlider
                        className="w-100 h-[50px] horizontal-slider"
                        // marks
                        markClassName="rating-mark h-[48px] w-[50px]"
                        min={0}
                        max={10}
                        value={props.venue.avg_venue_rating_value}
                        disabled={true}
                        thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb"
                        trackClassName="rating-track bg-gray-300 dark:bg-neutral-600 relative"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
            </Link>
        </div>
    )
}
