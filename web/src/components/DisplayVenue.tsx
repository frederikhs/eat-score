import {deleteVenue, Venue} from "../request";
import ReactSlider from "react-slider";
import React, {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAccount} from "../Root";
import {FaTrash} from "react-icons/fa";

export default function DisplayVenue(props: { venue: Venue }) {
    const {account} = useAccount()
    const navigate = useNavigate()

    const canDeleteVenue = useMemo(() => {
        if (props.venue === null || account === undefined) {
            return false
        }

        return props.venue.venue_created_by_account_id === account.account_id
    }, [props.venue, account]);

    const deleteExistingVenue = () => {
        if (props.venue === null) {
            return
        }

        deleteVenue(props.venue.venue_id).then(r => {
            if (r.code === 200) {
                navigate("/venues")
            }
        })
    }

    return (
        <div className="box">
            <div className={"mb-2"}>
                <Link to={"/venues/" + props.venue.venue_id}>
                    <h5 className="heading-default hover:underline">{props.venue.venue_name}</h5>
                </Link>
            </div>

            <ReactSlider
                className="w-100 h-[50px] horizontal-slider mb-2"
                markClassName="rating-mark h-[48px] w-[50px]"
                min={0}
                max={10}
                value={props.venue.avg_venue_rating_value}
                disabled={true}
                thumbClassName="text-center bg-gray-500 text-white rounded border-[5px] border-transparent rating-thumb"
                trackClassName="rating-track bg-gray-300 dark:bg-neutral-600 relative"
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            />

            {canDeleteVenue &&
                <div className={"mb-2"}>
                    <div className={"flex"}>
                        <span
                            className={"badge badge-gray flex items-center space-x-1 hover:cursor-pointer"}
                            onClick={() => window.confirm("Are you sure?") && deleteExistingVenue()}
                        >
                            <FaTrash/>
                            <span>Delete</span>
                        </span>
                    </div>
                </div>
            }
        </div>
    )
}
