import React, {useEffect, useState} from 'react';
import {fetchAllVenues, Venue} from "../request";
import ListVenue from "../components/Venue";

export default function ListVenuesPage() {
    const [venues, setVenues] = useState<Venue[] | null>(null);

    useEffect(() => {
        fetchAllVenues().then((r) => {
            setVenues(r.response)
        })
    }, [])

    if (venues === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className={"space-y-10"}>
            {venues.map((venue, index) => {
                return (
                    <ListVenue key={index} venue={venue}/>
                )
            })}
        </div>
    );
}
