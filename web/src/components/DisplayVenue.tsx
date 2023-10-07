import {deleteVenue, Venue} from "../request";
import React, {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAccount} from "../Root";
import {FaTrash} from "react-icons/fa";
import RateSlider from "./RateSlider";

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

            <RateSlider value={props.venue.avg_venue_rating_value} hideValue={false} disabled={true}/>

            {canDeleteVenue &&
                <div className={"mt-2"}>
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
