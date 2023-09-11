import React, {useEffect, useState} from 'react';
import {fetchItemsByVenueId, fetchVenueById, Item, Venue} from "../request";
import ListVenue from "../components/Venue";
import {useParams} from "react-router-dom";
import ListItems from "../components/ListItems";

export default function ShowVenuePage() {
    let {venue_id} = useParams();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        fetchVenueById(venue_id as unknown as number).then((r) => {
            setVenue(r.response)
        })
    }, [])

    useEffect(() => {
        fetchItemsByVenueId(venue_id as unknown as number).then((r) => {
            setItems(r.response)
        })
    }, [])

    if (venue === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className={"space-y-10"}>
            <h1 className={"heading-default"}>Venue</h1>
            <ListVenue venue={venue}/>
            <h1 className={"heading-default"}>Items</h1>
            {items !== null && <ListItems items={items} show_venue={false}/>}
        </div>
    );
}
