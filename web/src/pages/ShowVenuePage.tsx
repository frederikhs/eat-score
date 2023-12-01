import React, {useEffect, useMemo, useState} from 'react'
import {fetchItemsByVenueId, fetchVenueById, Item, Venue} from "../request"
import DisplayVenue from "../components/DisplayVenue"
import {useNavigate, useParams} from "react-router-dom"
import CreateItem from "../components/CreateItem"
import ListItems from "../components/ListItems"
import moment from "moment";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

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

    const data = useMemo(() => {
        if (items === null) {
            return null
        }

        if (venue_id !== "7") {
            return null
        }

        return items.reverse().map((item) => {
            return {
                created_at: moment(item.item_created_at).format("YYYY-MM-DD"),
                name: item.item_name,
                value: item.avg_item_rating_value,
            }
        })
    }, [items, venue_id])

    if (venue === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className={"space-y-4"}>
            <DisplayVenue venue={venue}/>

            {data !== null &&
                <div className={"box"} style={{height: "300px", width: "100%"}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                right: 20,
                                left: 20,
                            }}
                        >
                            <XAxis dataKey="name" hide={true}/>
                            <YAxis type="number" domain={[0, 10]} hide={true}/>
                            <Tooltip/>
                            {/*<Legend />*/}
                            <Line type="monotone" dataKey="value" stroke="#82ca9d"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }

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
