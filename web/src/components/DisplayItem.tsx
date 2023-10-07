import {deleteItem, Item} from "../request";
import React, {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import ReactSlider from "react-slider";
import {FaArrowDown, FaArrowRight, FaArrowUp, FaClock, FaQuestion, FaTrash, FaUsers} from "react-icons/fa";
import Moment from "react-moment";
import {FaArrowsUpDown} from "react-icons/fa6";
import {useAccount} from "../Root";

export default function DisplayItem(props: { item: Item, hide_rate_link?: boolean, show_delete_button?: boolean }) {
    const {account} = useAccount()
    const navigate = useNavigate()

    const hasRating = useMemo(() => {
        if (!props.item.has_rated_item) {
            return false
        }
        return props.item.avg_item_rating_value !== null;
    }, [props.item])

    const rating = useMemo(() => {
        if (hasRating) {
            return props.item.avg_item_rating_value as number
        }

        return 5;
    }, [hasRating, props.item])

    const canDeleteItem = useMemo(() => {
        if (account === undefined) {
            return false
        }
        return props.item.item_created_by_account_id === account.account_id
    }, [props.item, account]);

    const deleteExistingItem = () => {
        deleteItem(props.item.venue_id, props.item.item_id).then(r => {
            if (r.code === 200) {
                navigate(`/venues/${props.item.venue_id}`)
            }
        })
    }

    return (
        <div className="box">
            <div className={"mb-2"}>
                <Link to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}>
                    <h5 className="heading-default hover:underline">{props.item.item_name}</h5>
                </Link>
                <Link to={`/venues/${props.item.venue_id}`}>
                    <p className={"hover:underline dark:text-white"}>{props.item.venue_name}</p>
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
                        thumbClassName={"text-center text-white rounded border-[5px] border-transparent rating-thumb " + (hasRating ? 'bg-gray-400' : 'bg-mango-600')}
                        trackClassName="rating-track bg-gray-200 dark:bg-neutral-600 relative"
                        renderThumb={(props, state) => <div {...props}>{hasRating ? state.valueNow : <FaQuestion className={"h-8"} />}</div>}
                    />
                    {props.hide_rate_link !== true && (
                        <Link
                            to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}
                            className={"text-white text-center font-bold flex items-center space-x-1 py-2 px-4 rounded " + (hasRating ? 'bg-gray-300 dark:bg-neutral-600 hover:bg-gray-500 hover:dark:bg-neutral-700' : 'bg-mango-600 hover:bg-mango-700')}
                        >
                            <span>Rate</span><FaArrowRight/>
                        </Link>
                    )}
                </div>
            </div>

            <div className={"flex justify-between items-center"}>
                <div className={"flex flex-wrap gap-y-2"}>
                    <InfoBadge icon={<FaClock/>} title={<span>Created <Moment date={props.item.item_created_at} fromNow/></span>} hide={false}/>
                    <InfoBadge icon={<FaUsers/>} title={`${props.item.item_rating_count} rating${props.item.item_rating_count !== 1 ? 's' : ''}`} hide={!hasRating}/>
                    {props.item.max_item_rating_value !== null &&
                        <InfoBadge icon={<FaArrowUp/>} title={props.item.max_item_rating_value} description={"Highest rating"} hide={!hasRating || props.item.item_rating_count <= 1}/>}
                    {props.item.min_item_rating_value !== null &&
                        <InfoBadge icon={<FaArrowDown/>} title={props.item.min_item_rating_value} description={"Lowest rating"} hide={!hasRating || props.item.item_rating_count <= 1}/>}
                    {props.item.standard_deviation_item_rating_value !== null && <InfoBadge
                        icon={<FaArrowsUpDown/>}
                        title={props.item.standard_deviation_item_rating_value}
                        description={"Standard deviation"}
                        hide={!hasRating}
                    />}
                    {canDeleteItem && props.show_delete_button &&
                        <div className={"flex"}>
                            <span className={"badge badge-gray flex items-center space-x-1 hover:cursor-pointer"}
                                  onClick={() => window.confirm(`Are you sure you want to delete ${props.item.item_name}?`) && deleteExistingItem()}
                            >
                                <FaTrash/>
                                <span>Delete</span>
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function InfoBadge(props: { icon: React.ReactNode, title: React.ReactNode, hide: boolean, description?: string }) {
    if (props.hide) {
        return null
    }

    return (
        <div className={"flex"}>
            <span className={"badge group badge-gray flex items-center space-x-1"}>
                {props.icon}
                <span>{props.title}</span>
                {props.description && <span className={"hidden group-hover:block"}>({props.description})</span>}
            </span>
        </div>
    )
}