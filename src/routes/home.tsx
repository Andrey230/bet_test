import EventsContainer from "../Components/EventsContainer";
import {getEvents, getWaitingEvents} from "../api/endpoints";
import { useLoaderData } from "react-router-dom";
import {useTonConnect} from "../hooks/useTonConnect";
import {useEffect, useState} from "react";

export async function loader({ params }) {
    let events = [];

    await getEvents().then((response) => response.json())
        .then((data) => {
            events = data.events ?? [];
        })
        .catch((error) => console.log(error));

    return { events };
}

export default function Home(){
    const { events } = useLoaderData();
    const [waitingEventsCount, setWaitingEventsCount] = useState(0);
    const {wallet, connected} = useTonConnect();

    useEffect(() => {
        if(connected){
            getWaitingEvents(wallet?.toString()).then((response) => response.json())
                .then((data) => {
                    console.log(data.totalEvents);
                    setWaitingEventsCount(data.totalEvents ?? 0);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);

    return (
        <>
            {waitingEventsCount > 0 ?
                <a href="/app/profile/waiting">
                    <div role="alert" className="alert alert-warning drop-shadow-lg mb-3 rounded-lg">
                        <div className="text-xs">{waitingEventsCount} event(s) is waiting for your decision. You have only 24 hours to set winner option. Tap to see</div>
                    </div>
                </a>
                : ""}
            <EventsContainer events={events} title="Top events"/>
        </>
    )
}