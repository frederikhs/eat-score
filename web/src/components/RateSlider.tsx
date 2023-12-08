import ReactSlider from "react-slider";
import React, {useMemo, useState} from "react";
import {FaQuestion} from "react-icons/fa";

export default function RateSlider(props: {
    value: number,
    hideValue: boolean,
    disabled: boolean,
    onChange?: ((value: number, index: number) => void)
    min?: number
    max?: number
    show_decimals?: boolean
}) {
    const [hasTouched, setHasTouched] = useState(false);

    const pulseClass = useMemo(() => {
        let classes = []

        if (!props.hideValue && !props.disabled) {
            classes.push("cursor-pointer")

            if (!hasTouched) {
                classes.push("animate-bounce")
            }
        }

        if (!props.hideValue && props.disabled) {
            classes.push("bg-gray-500")
        } else {
            classes.push("bg-mango-600")
        }

        return classes.join(" ")
    }, [props.hideValue, props.disabled, hasTouched])

    const onChange = (value: number, index: number) => {
        if (!hasTouched) {
            setHasTouched(true)
        }

        if (props.onChange) {
            props.onChange(value, index)
        }
    }

    return (
        <ReactSlider
            className="h-[50px] horizontal-slider flex-grow"
            markClassName="rating-mark h-[48px] w-[50px]"
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 10}
            value={props.value}
            disabled={props.disabled}
            onChange={onChange}
            thumbClassName={`text-center text-white rounded border-[5px] border-transparent rating-thumb ${pulseClass}`}
            trackClassName="rating-track bg-gray-200 dark:bg-neutral-600 relative"
            renderThumb={(_props, state) => <div {..._props}>{props.hideValue ? <FaQuestion className={"h-8"}/> : (props.show_decimals ? props.value : state.valueNow)}</div>}
        />
    )
}
