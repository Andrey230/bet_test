import {useTonConnect} from "../../hooks/useTonConnect";
import {useEffect, useState} from "react";
import {getWaitingEvents} from "../../api/endpoints";
import EventsContainer from "../../Components/EventsContainer";

export default function ProfileWaiting(){
    const [waitingEvents, setWaitingEvents] = useState([]);
    const {wallet, connected} = useTonConnect();

    useEffect(() => {
        if(connected){
            getWaitingEvents(wallet?.toString()).then((response) => response.json())
                .then((data) => {
                    setWaitingEvents(data.events ?? []);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);


    return (
        <>
            <EventsContainer events={waitingEvents} title="Waiting events" search={false} categories={false} waiting={true} more={false}/>
        </>
    );
}