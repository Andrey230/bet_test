import {useTonConnect} from "../../hooks/useTonConnect";
import {useEffect, useState} from "react";
import {getEvents, getWaitingEvents} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";
import {useLoader} from "../root";

export default function ProfileWaiting(){
    const [waitingEvents, setWaitingEvents] = useState([]);
    const {wallet, connected} = useTonConnect();
    const {setLoading} = useLoader();

    useEffect(() => {
        if(connected){
            getWaitingEvents(wallet?.toString()).then((response) => response.json())
                .then((data) => {
                    setWaitingEvents(data.events ?? []);
                    setLoading(false);
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