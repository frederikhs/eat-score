import React, {useEffect, useState} from 'react';
import {fetchItemByVenueIdAndItemId, fetchItemRatingsByVenueIdAndItemId, fetchVenueById, Item, ItemRating, Venue} from "../request";
import ListVenue from "../components/Venue";
import {useParams} from "react-router-dom";
import ListItems from "../components/ListItems";
import ListRatings from "../components/ListRatings";
import Rate from "../components/Rate";

export default function ShowItemPage() {
    let {venue_id, item_id} = useParams();
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

    return (
        <div className={"space-y-10"}>
            <h1 className={"heading-default"}>Venue</h1>
            {venue !== null && <ListVenue venue={venue}/>}

            <h1 className={"heading-default"}>Item</h1>
            {item !== null && <ListItems items={[item]} show_venue={false}/>}

            <h1 className={"heading-default"}>Rate this item</h1>
            {venue !== null && item !== null && <Rate venue_id={venue.venue_id} item_id={item.item_id} onSubmit={() => fetchAll()}/>}

            <h1 className={"heading-default"}>Account ratings</h1>
            {itemRatings !== null && <ListRatings item_ratings={itemRatings}/>}
        </div>
    );
}
