import React, {useState} from "react";
import {createItemRating} from "../request";
import {FaPlus} from "react-icons/fa";
import RateSlider from "./RateSlider";

export default function Rate(props: { venue_id: number, item_id: number, onSubmit: () => void }) {
    const [rating, setRating] = useState(5);

    const submit = () => {
        createItemRating(props.venue_id, props.item_id, rating).then(r => {
            if (r.code === 201) {
                props.onSubmit()
            }
        })
    }

    return (
        <div className={"flex items-center space-x-6"}>
            <RateSlider value={rating} onChange={(value) => setRating(value)} hideValue={false} disabled={false}/>

            <div>
                <button onClick={() => submit()} className={"py-2 pl-3 pr-4 rounded text-white bg-mango-600 hover:bg-mango-700"}>
                    <div className={"flex items-center justify-center space-x-3"}>
                        <span className={"w-12"}>Rate</span>
                        <FaPlus/>
                    </div>
                </button>
            </div>
        </div>
    )
}
