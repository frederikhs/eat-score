import {Item} from "../request";
import React from "react";
import {Link} from "react-router-dom";
import {FaClock, FaPlus, FaUsers} from "react-icons/fa";
import Moment from "react-moment";
import ReactSlider from "react-slider";

export default function ListItems(props: { items: Item[], show_venue: boolean, extra_row?: React.ReactNode }) {
    return (
        <div className={"space-y-4"}>
            {props.extra_row}
            <div className={"grid sm:grid-cols-3 gap-3"}>
                {props.items.map((item, index) => {
                    return <DisplayItem key={index} item={item}/>
                })}
            </div>
        </div>
    )
}

function DisplayItem(props: { item: Item }) {
    return (
        <div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
            <div className={"mb-2"}>
                <Link to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}>
                    <h5 className="text-2xl font-semibold tracking-tight text-gray-900 hover:underline">{props.item.item_name}</h5>
                </Link>
                <Link to={`/venues/${props.item.venue_id}`}>
                    <p className={"hover:underline"}>{props.item.venue_name}</p>
                </Link>
            </div>

            <div className={"mb-3"}>
                {props.item.avg_item_rating_value !== null &&
                    <ReactSlider
                        className="w-100 h-[50px] horizontal-slider"
                        markClassName="rating-mark h-[48px] w-[50px]"
                        min={0}
                        max={10}
                        value={props.item.avg_item_rating_value}
                        disabled={true}
                        thumbClassName="text-center bg-mango-600 text-white rounded border-[5px] border-transparent rating-thumb"
                        trackClassName="rating-track bg-gray-200 relative"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                }
                {props.item.avg_item_rating_value === null && <span className={"flex justify-start text-gray-400"}>No ratings yet</span>}
            </div>

            <div className={"flex justify-between items-center"}>
                <div className={"flex flex-wrap"}>
                    <div className={"flex"}>
                            <span className={"badge badge-gray flex items-center space-x-1"}>
                                <FaClock/>
                                <Moment date={props.item.item_created_at} fromNow/>
                            </span>
                    </div>
                    <div className={"flex"}>
                            <span className={"badge badge-gray flex items-center space-x-1"}>
                                <FaUsers/>
                                <span>{props.item.item_rating_count}</span>
                            </span>
                    </div>
                </div>

                <Link to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`} className="text-xs font-medium text-mango-500 hover:underline">
                        <span className={"badge badge-mango flex items-center space-x-1"}>
                            <FaPlus/>
                            <span>Rate</span>
                        </span>
                </Link>
            </div>
        </div>
    )
}
