import { useLoaderData } from "react-router-dom";

import {getProfileEvents} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";

export async function loader({ params }) {
    const address = params.address;
    let events = [];
    let eventCount = 0;


    await getProfileEvents(address).then((response) => response.json())
        .then((data) => {
            eventCount = data.eventCount ?? 0;
            events = data.events ?? [];
        })
        .catch((error) => console.log(error));

    return { address, events, eventCount };
}

export default function ProfileView(){
    const { address, events, eventCount } = useLoaderData();

    return (
        <>
            <h1 className="text-3xl font-semibold mb-5">Your events</h1>
            <div className="stats shadow mb-5">
                <div className="stat">
                    <div className="stat-title">Total events</div>
                    <div className="stat-value">{eventCount}</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

            </div>
            <EventGrid events={events} />
        </>
    );
}