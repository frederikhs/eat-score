import {deleteItem, Item} from "../request";
import React, {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaArrowDown, FaArrowRight, FaArrowUp, FaClock, FaTrash, FaUsers} from "react-icons/fa";
import Moment from "react-moment";
import {FaArrowsUpDown} from "react-icons/fa6";
import {useAccount} from "../Root";
import InfoBadge from "./InfoBadge";
import RateSlider from "./RateSlider";
import moment from "moment";

export default function DisplayItem(props: { item: Item, hide_rate_link?: boolean, show_delete_button?: boolean, is_peeking?: boolean }) {
    const {account} = useAccount()
    const navigate = useNavigate()

    const hasRating = useMemo(() => {
        if (!props.item.has_rated_item && !props.is_peeking) {
            return false
        }
        return props.item.avg_item_rating_value !== null;
    }, [props.item, props.is_peeking])

    const rating = useMemo(() => {
        if (hasRating || props.is_peeking) {
            return props.item.avg_item_rating_value as number
        }

        return 5;
    }, [hasRating, props.item, props.is_peeking])

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

    const boxExtraClass = useMemo(() => {
        return moment(props.item.item_created_at).isSame(moment(), "day")
            ? "!border-mango-600 dark:border-mango-600 !border-4"
            : ""
    }, [props.item])

    return (
        <div className={`${boxExtraClass} box`}>
            <div className={"mb-2"}>
                <div className={"flex justify-between"}>
                    <Link to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}>
                        <h5 className="heading-default hover:underline">{props.item.item_name}</h5>
                    </Link>

                    {props.item.item_price_dkk > 0 && (
                        <h5 className={"heading-default"}>
                            {props.item.item_price_dkk > 0 && `${props.item.item_price_dkk} kr.`}
                        </h5>
                    )}
                </div>


                <Link to={`/venues/${props.item.venue_id}`}>
                    <p className={"hover:underline dark:text-white"}>{props.item.venue_name}</p>
                </Link>
            </div>

            <div className={"mb-2 group"}>
                <div className={"flex items-center space-x-4"}>
                    <RateSlider value={rating} hideValue={!props.is_peeking && !hasRating} disabled={true}/>

                    {props.hide_rate_link !== true && (
                        <Link
                            to={`/venues/${props.item.venue_id}/items/${props.item.item_id}`}
                            className={"text-white text-center font-bold flex items-center space-x-1 py-2 px-4 rounded " + (hasRating ? 'bg-gray-300 dark:bg-neutral-600 hover:bg-gray-500 hover:dark:bg-neutral-700' : 'bg-mango-600 hover:bg-mango-700')}
                        >
                            <span className={"w-12"}>{hasRating ? 'Show' : 'Rate'}</span>
                            <FaArrowRight className={"group-hover:animate-[propel_1s_infinite]"}/>
                        </Link>
                    )}
                </div>
            </div>

            <div className={"flex justify-between items-center"}>
                <div className={"flex flex-wrap gap-y-2"}>
                    <InfoBadge
                        icon={<FaClock/>}
                        title={<span><Moment date={props.item.item_created_at} format={'LL'}/></span>}
                        description={props.item.item_created_by_account_name}
                        hide={false}
                    />
                    <InfoBadge
                        icon={<FaUsers/>}
                        title={`${props.item.item_rating_count} rating${props.item.item_rating_count !== 1 ? 's' : ''}`}
                        hide={!hasRating}
                    />
                    {props.item.max_item_rating_value !== null &&
                        <InfoBadge
                            icon={<FaArrowUp/>}
                            title={props.item.max_item_rating_value}
                            description={"Highest rating"}
                            hide={!hasRating || props.item.item_rating_count <= 1}
                        />}
                    {props.item.min_item_rating_value !== null &&
                        <InfoBadge
                            icon={<FaArrowDown/>}
                            title={props.item.min_item_rating_value}
                            description={"Lowest rating"}
                            hide={!hasRating || props.item.item_rating_count <= 1}
                        />}
                    {props.item.standard_deviation_item_rating_value !== null && <InfoBadge
                        icon={<FaArrowsUpDown/>}
                        title={props.item.standard_deviation_item_rating_value}
                        description={"Standard deviation"}
                        hide={!hasRating}
                    />}
                    {canDeleteItem && props.show_delete_button &&
                        <div className={"flex"}>
                            <span
                                className={"badge badge-gray flex items-center space-x-1 hover:cursor-pointer"}
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
