import {useTonConnect} from "../../hooks/useTonConnect";
import {useEffect, useState} from "react";
import {getWaitingEvents} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";

export default function ProfileWaiting(){
    const [waitingEvents, setWaitingEvents] = useState([]);
    const {wallet, connected} = useTonConnect();

    useEffect(() => {
        if(connected){
            getWaitingEvents(wallet?.toString()).then((response) => response.json())
                .then((data) => {
                    console.log(data.events);
                    setWaitingEvents(data.events ?? []);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);


    return (
        <>
            <h1 className="text-3xl font-semibold mb-5">Waiting events</h1>
            <EventGrid events={waitingEvents} waiting={true}/>
        </>
    );
}