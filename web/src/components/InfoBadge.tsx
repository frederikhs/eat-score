import React from "react";

export default function InfoBadge(props: { icon: React.ReactNode, title: React.ReactNode, hide: boolean, description?: string }) {
    if (props.hide) {
        return null
    }

    return (
        <div className={"flex"}>
            <span className={"badge group badge-gray flex items-center space-x-1"}>
                {props.icon}
                <span>{props.title}</span>
                {props.description && <span className={"hidden group-hover:block"}>({props.description})</span>}
            </span>
        </div>
    )
}