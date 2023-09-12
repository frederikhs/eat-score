import {Venue} from "../request";
import ReactSlider from "react-slider";
import React from "react";
import {Link} from "react-router-dom";

export default function ListVenue(props: { venue: Venue }) {
    return (
        <div className="rounded overflow-hidden shadow-md">
            <Link to={"/venues/" + props.venue.venue_id}>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{props.venue.venue_name}</div>
                    {/*<p className="text-gray-700 text-base">*/}
                    {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.*/}
                    {/*</p>*/}
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
                        trackClassName="rating-track bg-gray-300 relative"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
            </Link>
        </div>
    )
}
