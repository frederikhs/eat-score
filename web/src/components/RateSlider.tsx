import ReactSlider from "react-slider";
import React from "react";
import {FaQuestion} from "react-icons/fa";

export default function RateSlider(props: {
    value: number,
    hideValue: boolean,
    disabled: boolean,
    onChange?: ((value: number, index: number) => void)
    min?: number
    max?: number
}) {
    return (
        <ReactSlider
            className="h-[50px] horizontal-slider flex-grow"
            markClassName="rating-mark h-[48px] w-[50px]"
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 10}
            value={props.value}
            disabled={props.disabled}
            onChange={props.onChange}
            thumbClassName={"text-center text-white rounded border-[5px] border-transparent rating-thumb " + (props.hideValue || !props.disabled ? 'bg-mango-600' : 'bg-gray-500')}
            trackClassName="rating-track bg-gray-200 dark:bg-neutral-600 relative"
            renderThumb={(_props, state) => <div {..._props}>{props.hideValue ? <FaQuestion className={"h-8"}/> : state.valueNow}</div>}
        />
    )
}
