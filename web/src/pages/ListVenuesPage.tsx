import React, {useEffect, useMemo, useState} from 'react';
import {createVenue, fetchAllVenues, Venue} from "../request";
import DisplayVenue from "../components/DisplayVenue";
import {useNavigate} from "react-router-dom";

export default function ListVenuesPage() {
    const navigate = useNavigate()
    const [venues, setVenues] = useState<Venue[] | null>(null);
    const [venueName, setVenueName] = useState<string>("");
    const [venueCreatedMessage, setVenueCreationMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchVenues()
    }, [])

    const fetchVenues = () => {
        fetchAllVenues().then((r) => {
            if (r.code === 200) {
                setVenues(r.response)
            }
        })
    }

    const createNewVenue = () => {
        createVenue(venueName).then(r => {
            setVenueCreationMessage(r.response.message)
            if (r.code === 201) {
                setVenueName("")
                navigate("/venues/" + r.response.venue_id)
            }
        })
    }

    const canCreateNewVenue = useMemo(() => {
        return venueName.length >= 3
    }, [venueName]);

    if (venues === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div>
            <h1 className={"heading-default"}>Venues</h1>
            <div className="rounded overflow-hidden shadow-md mb-4 dark:bg-neutral-800">
                <div className="px-6 py-4 space-x-4 flex">
                    <input
                        value={venueName}
                        name={"venue_name"}
                        placeholder={"The Burger Shop"}
                        autoComplete={"off"}
                        onChange={e => setVenueName(e.target.value)}
                        className="text-center appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-600 dark:border-neutral-700 dark:text-white"
                        type="text"
                    />
                    <button
                        disabled={!canCreateNewVenue}
                        onClick={() => createNewVenue()}
                        className={"flex-none text-white font-bold py-2 px-4 rounded " + (canCreateNewVenue ? "bg-mango-600 hover:bg-mango-700" : "bg-gray-300 dark:bg-neutral-500 hover:cursor-not-allowed")}
                    >Create new Venue
                    </button>
                </div>
                {venueCreatedMessage !== null && <p className={"text-center mb-2"}>{venueCreatedMessage}</p>}
            </div>
            <div className={"space-y-10 sm:columns-2"}>
                {venues.map((venue, index) => {
                    return (
                        <DisplayVenue key={index} venue={venue}/>
                    )
                })}
            </div>
        </div>
    );
}
