import {Item} from "../request";
import React from "react";
import DisplayItem from "./DisplayItem";

export default function ListItems(props: { items: Item[], show_venue: boolean }) {
    return (
        <div className={"grid sm:grid-cols-1 gap-4"}>
            {props.items.map((item, index) => {
                return <DisplayItem key={index} item={item}/>
            })}
        </div>
    )
}
