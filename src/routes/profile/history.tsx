import {getTickets} from "../../api/endpoints";
import {useEffect, useState} from "react";
import {useTonConnect} from "../../hooks/useTonConnect";
import {Address} from "ton-core";
import {useLoader} from "../root";
import EventTickets from "../../Components/EventTickets";
import {useTranslation} from "react-i18next";

export default function ProfileHistory(){
    const {wallet, connected} = useTonConnect();
    const [events, setEvents] = useState([]);
    const {setLoading} = useLoader();
    const [t] = useTranslation("global");

    useEffect(() => {
        if(connected){
            getTickets(Address.parse(wallet?.toString()).toString(), {all: "true"}).then((response) => response.json())
                .then((data) => {
                    //setEvents(data ?? []);
                    setLoading(false);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);

    return (
        <>
            <h1 className="text-3xl font-semibold">{t("profile.history")}</h1>
            <div className="flex flex-col gap-5 mt-5">
                {events.length > 0 ? events.map((event, index) => {
                    return <EventTickets event={event} key={index} history={true}/>;
                }) : <p className="text-lg font-semibold italic text-primary">{t("profile.empty_tickets")}</p>}
            </div>
        </>
    );
}