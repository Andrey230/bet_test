import { useLoaderData } from "react-router-dom";
import EventsContainer from "../../Components/EventsContainer";
import {getEvents} from "../../api/endpoints";

export async function loader({ params }) {
    const address = params.address;
    let events = [];
    let eventCount = 0;


    await getEvents({
        profile: address
    }).then((response) => response.json())
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
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total events</div>
                    <div className="stat-value">{eventCount}</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

            </div>
            <EventsContainer events={events} search={false} title="Profile events" categories={false}/>
        </>
    );
}