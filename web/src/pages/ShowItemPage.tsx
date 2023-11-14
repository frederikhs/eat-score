import React, {useEffect, useState} from 'react';
import {fetchItemByVenueIdAndItemId, fetchItemRatingsByVenueIdAndItemId, fetchVenueById, Item, ItemRating, Venue} from "../request";
import {useParams} from "react-router-dom";
import ListRatings from "../components/ListRatings";
import Rate from "../components/Rate";
import {useAccount} from "../Root";
import DisplayItem from "../components/DisplayItem";

export default function ShowItemPage() {
    const {account} = useAccount()
    let {venue_id, item_id} = useParams();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [itemRatings, setItemRatings] = useState<ItemRating[] | null>(null);
    const [isPeeking, setIsPeeking] = useState<boolean>(false);

    const fetchVenue = () => {
        fetchVenueById(venue_id as unknown as number).then((r) => {
            setVenue(r.response)
        })
    }

    const fetchItem = () => {
        fetchItemByVenueIdAndItemId(venue_id as unknown as number, item_id as unknown as number).then((r) => {
            setItem(r.response)
        })
    }

    const fetchRatings = () => {
        fetchItemRatingsByVenueIdAndItemId(venue_id as unknown as number, item_id as unknown as number).then((r) => {
            setItemRatings(r.response)
        })
    }

    const fetchAll = () => {
        fetchVenue()
        fetchItem()
        fetchRatings()
    }

    useEffect(() => {
        fetchAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={"space-y-4"}>
            {item !== null && <DisplayItem item={item} hide_rate_link={true} show_delete_button={true} is_peeking={isPeeking}/>}

            {item?.has_rated_item === false && (
                <div className="box">
                    <h1 className={"heading-default"}>Rate this item</h1>
                    {venue !== null && item !== null && <Rate venue_id={venue.venue_id} item_id={item.item_id} onSubmit={() => fetchAll()}/>}
                </div>
            )}

            <div className="box">
                <h1 className={"heading-default"}>Ratings</h1>
                {item?.has_rated_item === false && (
                    <p className={"dark:text-white"}>You need to rate this item to reveal it's score.
                        {itemRatings !== null && itemRatings.length > 0 && (
                            <span>
                                &nbsp;If you want a peak hover&nbsp;
                                <button onMouseEnter={() => setIsPeeking(true)} onMouseLeave={() => setIsPeeking(false)} className={"hover:underline text-blue-600"}>here</button>
                            </span>
                        )}
                    </p>
                )}
                {itemRatings !== null && item?.has_rated_item && account !== undefined && (
                    <ListRatings item_ratings={itemRatings} account_id={account.account_id} onDelete={() => fetchAll()}/>
                )}
            </div>
        </div>
    );
}
