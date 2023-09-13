import ReactSlider from "react-slider";
import React, {useState} from "react";
import {createItemRating} from "../request";

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
        <div>
            <ReactSlider
                className="w-100 h-[50px] horizontal-slider"
                markClassName="rating-mark h-[48px] w-[50px]"
                min={0}
                max={10}
                value={rating}
                onChange={(value) => setRating(value)}
                thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb hover:cursor-pointer"
                trackClassName="rating-track bg-gray-300 relative"
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            />
            <button onClick={() => submit()} className={"py-2 pl-3 pr-4 rounded text-white bg-blue-700"}>Submit</button>
        </div>
    )
}
