import React, {useEffect, useMemo, useState} from 'react';
import {createVenue, fetchAllVenues, Venue} from "../request";
import DisplayVenue from "../components/DisplayVenue";
import {useNavigate} from "react-router-dom";
import {FaPlus} from "react-icons/fa";

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
        <div className={"space-y-4"}>
            <div className="box">
                <div className={"mb-2"}>
                    <h5 className="heading-default hover:underline">Create new venue</h5>
                </div>
                <div className={"flex items-end space-x-2"}>
                    <div className={"grow"}>
                        <label htmlFor="item_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                            value={venueName}
                            name={"venue_name"}
                            placeholder={"The Burger Shop"}
                            autoComplete={"off"}
                            onChange={e => setVenueName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-500"
                            type="text"
                            required/>
                    </div>
                    <button
                        disabled={!canCreateNewVenue}
                        onClick={() => createNewVenue()}
                        className={"text-white font-bold py-2 px-4 rounded " + (canCreateNewVenue ? "bg-mango-600 hover:bg-mango-700" : "bg-gray-300 dark:bg-neutral-500 hover:cursor-not-allowed")}
                    >
                        <div className={"flex items-center justify-center space-x-3"}>
                            <span>Create</span>
                            <FaPlus/>
                        </div>
                    </button>
                </div>
                {venueCreatedMessage !== null && <p className={"text-center mb-2 dark:text-white"}>{venueCreatedMessage}</p>}
            </div>

            <h5 className="heading-default">Venues</h5>
            <div className={"space-y-4"}>
                {venues.map((venue, index) => {
                    return (
                        <DisplayVenue key={index} venue={venue}/>
                    )
                })}
            </div>
        </div>
    );
}
