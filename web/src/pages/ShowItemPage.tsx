import React, {useEffect, useMemo, useState} from 'react';
import {deleteItem, fetchItemByVenueIdAndItemId, fetchItemRatingsByVenueIdAndItemId, fetchVenueById, Item, ItemRating, Venue} from "../request";
import ListVenue from "../components/Venue";
import {useNavigate, useParams} from "react-router-dom";
import ListRatings from "../components/ListRatings";
import Rate from "../components/Rate";
import {useAccount} from "../Root";
import ListItems from "../components/ListItems";

export default function ShowItemPage() {
    const {account} = useAccount()
    let {venue_id, item_id} = useParams();
    const navigate = useNavigate()
    const [venue, setVenue] = useState<Venue | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [itemRatings, setItemRatings] = useState<ItemRating[] | null>(null);

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = () => {
        fetchItem()
        fetchRatings()
        fetchVenue()
    }

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

    const canDeleteItem = useMemo(() => {
        if (item === null || account === undefined) {
            return false
        }

        return item.item_created_by_account_id === account.account_id
    }, [item, account]);

    const deleteExistingItem = () => {
        if (item === null || venue === null) {
            return
        }

        deleteItem(venue.venue_id, item.item_id).then(r => {
            if (r.code === 200) {
                navigate(`/venues/${venue.venue_id}`)
            }
        })
    }

    return (
        <div className={"space-y-10"}>
            <h1 className={"heading-default"}>Venue</h1>
            {venue !== null && <ListVenue venue={venue}/>}

            <h1 className={"heading-default"}>Item</h1>
            {canDeleteItem &&
                <button
                    onClick={() => window.confirm("Are you sure?") && deleteExistingItem()}
                    className={"text-white font-bold py-2 px-4 rounded bg-red-700 hover:bg-red-600"}
                >
                    Delete Item
                </button>
            }
            {item !== null && <ListItems items={[item]} show_venue={false}/>}

            <h1 className={"heading-default"}>Rate this item</h1>
            {venue !== null && item !== null && <Rate venue_id={venue.venue_id} item_id={item.item_id} onSubmit={() => fetchAll()}/>}

            <h1 className={"heading-default"}>Account ratings</h1>
            {itemRatings !== null && <ListRatings item_ratings={itemRatings}/>}
        </div>
    );
}
