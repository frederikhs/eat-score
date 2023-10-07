import React, {useEffect, useState} from 'react'
import {fetchItemsByVenueId, fetchVenueById, Item, Venue} from "../request"
import DisplayVenue from "../components/DisplayVenue"
import {useNavigate, useParams} from "react-router-dom"
import CreateItem from "../components/CreateItem"
import ListItems from "../components/ListItems"

export default function ShowVenuePage() {
    let {venue_id} = useParams()
    const navigate = useNavigate()
    const [venue, setVenue] = useState<Venue | null>(null)
    const [items, setItems] = useState<Item[] | null>(null)

    useEffect(() => {
        fetchVenueById(venue_id as unknown as number).then((r) => {
            if (r.code === 404) {
                navigate("/venues")
            } else {
                setVenue(r.response)
            }
        })
    }, [navigate, venue_id])

    useEffect(() => {
        fetchItemsByVenueId(venue_id as unknown as number).then((r) => {
            setItems(r.response)
        })
    }, [venue_id])


    const createItem = (item_id: number) => {
        if (venue === null) {
            return
        }

        navigate(`/venues/${venue.venue_id}/items/${item_id}`)
    }

    if (venue === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className={"space-y-4"}>
            <DisplayVenue venue={venue}/>

            <div className={"box"}>
                <CreateItem venue_id={venue.venue_id} onSubmit={createItem}/>
            </div>

            {items !== null && items.length > 0 && (
                <>
                    <h5 className="heading-default">Items</h5>
                    <ListItems items={items} show_venue={false}/>
                </>
            )}
        </div>
    )
}
