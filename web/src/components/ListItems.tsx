import {Item} from "../request";
import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import {FaArrowRight, FaClock, FaUsers} from "react-icons/fa";
import Moment from "react-moment";
import ReactSlider from "react-slider";

export default function ListItems(props: { items: Item[], show_venue: boolean, extra_row?: React.ReactNode }) {
    return (
        <div className={"space-y-4"}>
            {props.extra_row}
            <div className={"grid sm:grid-cols-1 gap-3"}>
                {props.items.map((item, index) => {
                    return <DisplayItem key={index} item={item}/>
                })}
            </div>
        </div>
    )
}

function DisplayItem(props: { item: Item }) {
    const hasRating = useMemo(() => {
        return props.item.avg_item_rating_value !== null;
    }, [props.item])

    const rating = useMemo(() => {
        if (props.item.avg_item_rating_value !== null) {
            return props.item.avg_item_rating_value
        }

        return 5;
    }, [props.item])

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
            <div className={"mb-2"}>
                <Link to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}>
                    <h5 className="text-2xl font-semibold tracking-tight text-gray-900 hover:underline">{props.item.item_name}</h5>
                </Link>
                <Link to={`/venues/${props.item.venue_id}`}>
                    <p className={"hover:underline"}>{props.item.venue_name}</p>
                </Link>
            </div>

            <div className={"mb-3"}>
                <div className={"flex items-center space-x-4"}>
                    <ReactSlider
                        className="flex-grow h-[50px] horizontal-slider"
                        markClassName="rating-mark h-[48px] w-[50px]"
                        min={0}
                        max={10}
                        value={rating}
                        disabled={true}
                        thumbClassName="text-center bg-mango-600 text-white rounded border-[5px] border-transparent rating-thumb"
                        trackClassName="rating-track bg-gray-200 relative"
                        renderThumb={(props, state) => <div {...props}>{hasRating ? state.valueNow : '?'}</div>}
                    />
                    <Link
                        to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}
                        className={"text-white text-center font-bold flex items-center space-x-1 py-2 px-4 rounded bg-mango-600 hover:bg-mango-700"}
                    >
                        <span>Rate</span><FaArrowRight />
                    </Link>
                </div>
            </div>

            <div className={"flex justify-between items-center"}>
                <div className={"flex flex-wrap"}>
                    <div className={"flex"}>
                            <span className={"badge badge-gray flex items-center space-x-1"}>
                                <FaClock/>
                                <span>Created <Moment date={props.item.item_created_at} fromNow/></span>
                            </span>
                    </div>
                    <div className={"flex"}>
                            <span className={"badge badge-gray flex items-center space-x-1"}>
                                <FaUsers/>
                                <span>{props.item.item_rating_count} rating{props.item.item_rating_count > 1 ? 's' : ''}</span>
                            </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
