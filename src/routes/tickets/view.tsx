import {useEffect, useState} from "react";
import {getTickets} from "../../api/endpoints";
import {useTonConnect} from "../../hooks/useTonConnect";
import {Address} from "ton-core";
import EventTickets from "../../Components/EventTickets";
import {useLoader} from "../root";

export default function TicketsView(){
    const {wallet, connected} = useTonConnect();
    const [events, setEvents] = useState([]);
    const {setLoading} = useLoader();

    useEffect(() => {
        if(connected){
            getTickets(Address.parse(wallet?.toString()).toString()).then((response) => response.json())
                .then((data) => {
                    setEvents(data ?? []);
                    setLoading(false);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);

    return (
        <>
            <h1 className="text-3xl font-semibold">Your tickets</h1>
            <div className="flex flex-col gap-3 mt-5">
                {events.map((event, index) => {
                    return <EventTickets event={event} key={index}/>;
                })}
            </div>
        </>
    );
}