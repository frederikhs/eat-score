import React, {useEffect, useMemo, useState} from 'react';
import {deleteVenue, fetchItemsByVenueId, fetchVenueById, Item, Venue} from "../request";
import ListVenue from "../components/Venue";
import {useNavigate, useParams} from "react-router-dom";
import ListItems from "../components/ListItems";
import {useAccount} from "../Root";

export default function ShowVenuePage() {
    const {account} = useAccount()
    let {venue_id} = useParams();
    const navigate = useNavigate()
    const [venue, setVenue] = useState<Venue | null>(null);
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        fetchVenueById(venue_id as unknown as number).then((r) => {
            if (r.code === 404) {
                navigate("/venues")
            } else {
                setVenue(r.response)
            }
        })
    }, [])

    useEffect(() => {
        fetchItemsByVenueId(venue_id as unknown as number).then((r) => {
            setItems(r.response)
        })
    }, [])

    const canDeleteVenue = useMemo(() => {
        if (venue === null || account === undefined) {
            return false
        }

        return venue.venue_created_by_account_id === account.account_id
    }, [venue, account]);

    const deleteExistingVenue = () => {
        if (venue === null) {
            return
        }

        deleteVenue(venue.venue_id).then(r => {
            if (r.code === 200) {
                navigate("/venues")
            }
        })
    }

    if (venue === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className={"space-y-10"}>
            <h1 className={"heading-default"}>Venue</h1>
            {canDeleteVenue &&
                <button onClick={() => deleteExistingVenue()} className={"text-white font-bold py-2 px-4 rounded bg-red-700 hover:bg-red-600"}>
                    Delete
                </button>
            }
            <ListVenue venue={venue}/>
            <h1 className={"heading-default"}>Items</h1>
            {items !== null && <ListItems items={items} show_venue={false}/>}
        </div>
    );
}
