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
        fetchVenueById(venue_id as unknown as number).then((r) => {
            setVenue(r.response)
        })
    }, [])

    useEffect(() => {
        fetchItemByVenueIdAndItemId(venue_id as unknown as number, item_id as unknown as number).then((r) => {
            setItem(r.response)
        })
    }, [])

    const fetchRatings = () => {
        fetchItemRatingsByVenueIdAndItemId(venue_id as unknown as number, item_id as unknown as number).then((r) => {
            setItemRatings(r.response)
        })
    }

    useEffect(() => {
        fetchRatings()
    }, [])

    return (
        <div className={"space-y-10"}>
            <h1 className={"mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900"}>Venue</h1>
            {venue !== null && <ListVenue venue={venue}/>}

            <h1 className={"mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900"}>Item</h1>
            {item !== null && <ListItems items={[item]} show_venue={false}/>}

            {venue !== null && item !== null && <Rate venue_id={venue.venue_id} item_id={item.item_id} onSubmit={() => fetchRatings()}/>}

            <h1 className={"mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900"}>Account ratings</h1>
            {itemRatings !== null && <ListRatings item_ratings={itemRatings}/>}
        </div>
    );
}
