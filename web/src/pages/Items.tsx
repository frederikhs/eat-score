import React, {useEffect, useState} from 'react';
import {fetchAllItems, Item} from "../request";
import ListItems from "../components/ListItems";

export default function Items() {
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        fetchAllItems().then((r) => {
            setItems(r.response)
        })
    }, [])

    if (items === null) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div>
            <ListItems items={items} show_venue={true}/>
        </div>
    );
}
