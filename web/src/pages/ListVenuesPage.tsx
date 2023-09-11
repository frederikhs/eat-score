import React, {useEffect, useState} from 'react';
import {fetchAllVenues, Venue} from "../request";
import ListVenue from "../components/Venue";

export default function ListVenuesPage() {
    const [venues, setVenues] = useState<Venue[] | null>(null);

    useEffect(() => {
        fetchAllVenues().then((r) => {
            if (r.code === 200) {
                setVenues(r.response)
            }
        })
    }, [])

    if (venues === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div>
            <h1 className={"heading-default"}>Venues</h1>
            <div className={"space-y-10 sm:columns-2"}>
                {venues.map((venue, index) => {
                    return (
                        <ListVenue key={index} venue={venue}/>
                    )
                })}
            </div>
        </div>
    );
}
