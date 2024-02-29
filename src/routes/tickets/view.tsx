import {useEffect, useState} from "react";
import {getTickets} from "../../api/endpoints";
import {useTonConnect} from "../../hooks/useTonConnect";
import {Address} from "ton-core";
import EventTickets from "../../Components/EventTickets";
import {useLoader} from "../root";
import {useTranslation} from "react-i18next";

export default function TicketsView(){
    const {wallet, connected} = useTonConnect();
    const [events, setEvents] = useState([]);
    const {loading, setLoading} = useLoader();
    const [t] = useTranslation("global");

    useEffect(() => {
        if(connected){
            getTickets(Address.parse(wallet?.toString()).toString()).then((response) => response.json())
                .then((data) => {
                    setEvents(data ?? []);
                    setLoading(false);
                })
                .catch((error) => console.log(error));
        }
    }, [connected, loading]);

    return (
        <>
            <h1 className="text-3xl font-semibold text-neutral">{t("profile.your_tickets")}</h1>
            <div className="flex flex-col gap-5 mt-5">
                {events.length > 0 ? events.map((event, index) => {
                    return <EventTickets event={event} key={index}/>;
                }) : <p className="text-lg font-semibold italic text-primary">{t("profile.empty_tickets")}</p>}
            </div>
        </>
    );
}