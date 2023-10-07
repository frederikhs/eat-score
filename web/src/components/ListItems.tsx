import {Item} from "../request";
import React from "react";
import DisplayItem from "./DisplayItem";

export default function ListItems(props: { items: Item[], show_venue: boolean, extra_row?: React.ReactNode }) {
    return (
        <div className={"space-y-4"}>
            {props.extra_row}
            <div className={"grid sm:grid-cols-1 gap-3"}>
                {props.items.map((item, index) => {
                    return <DisplayItem key={index} item={item}/>
                })}
            </div>
        </div>
    )
}
