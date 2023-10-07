import ReactSlider from "react-slider";
import React, {useState} from "react";
import {createItemRating} from "../request";
import {FaPlus} from "react-icons/fa";

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
            <ReactSlider
                className="h-[50px] horizontal-slider flex-grow"
                markClassName="rating-mark h-[48px] w-[50px]"
                min={0}
                max={10}
                value={rating}
                onChange={(value) => setRating(value)}
                thumbClassName="text-center bg-mango-600 text-white rounded border-[5px] border-transparent rating-thumb hover:cursor-pointer"
                trackClassName="rating-track bg-gray-300 dark:bg-neutral-600 relative hover:cursor-pointer"
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            />
            <div>
                <button onClick={() => submit()} className={"py-2 pl-3 pr-4 rounded text-white bg-mango-600 hover:bg-mango-700"}>
                    <div className={"flex items-center justify-center space-x-3"}>
                        <span>Rate</span>
                        <FaPlus/>
                    </div>
                </button>
            </div>
        </div>
    )
}
