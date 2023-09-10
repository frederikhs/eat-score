import React from "react";

export default function Frame(props: { content: React.ReactNode }) {
    return (
        <div className={"max-w-screen-xl mx-auto p-4"}>
            {props.content}
        </div>
    )
}
