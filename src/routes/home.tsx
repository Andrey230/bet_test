import {getEvents, getWaitingEvents} from "../api/endpoints";
import { useLoaderData } from "react-router-dom";
import {useTonConnect} from "../hooks/useTonConnect";
import {useCallback, useEffect, useState} from "react";
import EventGrid from "../Components/EventGrid";
import {useLoader, useStartRedirect} from "./root";
import { NavLink } from "react-router-dom"
import {useTranslation} from "react-i18next";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";

export async function loader({ params }) {
    let defaultEvents = [];

    await getEvents().then((response) => response.json())
        .then((data) => {
            defaultEvents = data.events ?? [];
        })
        .catch((error) => console.log(error));

    return { defaultEvents };
}

export default function Home(){
    const { defaultEvents } = useLoaderData();
    const {startRedirect, setStartRedirect} = useStartRedirect();
    const {setLoading} = useLoader();
    let navigate = useNavigate();

    useEffect(() => {
        const eventId = findStartParam();

        if(!startRedirect && eventId){
            setStartRedirect(true);
            return navigate('/event/' + eventId);
        }

        setLoading(false);
    }, []);

    const [waitingEventsCount, setWaitingEventsCount] = useState(0);
    const {wallet, connected} = useTonConnect();
    const [searchValue, setSearchValue] = useState('');
    const [events, setEvents] = useState(defaultEvents);
    const [t] = useTranslation("global");

    useEffect(() => {
        if(connected){
            getWaitingEvents(wallet?.toString()).then((response) => response.json())
                .then((data) => {
                    setWaitingEventsCount(data.totalEvents ?? 0);
                })
                .catch((error) => console.log(error));
        }
    }, [connected]);

    const debounce = (func, delay) => {
        let timerId;
        return function (...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const delayedSearch = useCallback(
        debounce(async (value) => {
            await getEvents({
                term: value
            }).then((response) => response.json())
                .then((data) => {
                    setEvents(data.events ?? []);
                })
                .catch((error) => console.log(error));
        }, 1000),
        []
    );

    const searchInputHandler = (element) => {
        const value = element.target.value;
        setSearchValue(value);
        delayedSearch(value);
    }

    return (
        <>
            {waitingEventsCount > 0 ?
                <NavLink to="profile/waiting">
                    <div role="alert" className="alert alert-warning drop-shadow-lg mb-3 rounded-lg">
                        <div className="text-xs">{t("notification.waiting", {count: waitingEventsCount})}</div>
                    </div>
                </NavLink>
                : ""}
            <input type="text" id="find-event-input" placeholder={t("main.search.placeholder")} className="drop-shadow-lg input w-full max-w-xs mb-5" value={searchValue} onChange={searchInputHandler}/>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{t("main.categories.top")}</h1>
                <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" className="btn bg-base-100">{t("main.categories.label")}</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 mt-3 rounded-box w-52">
                        <li><a>{t("main.categories.top")}</a></li>
                        <li><a>{t("main.categories.new")}</a></li>
                    </ul>
                </div>
            </div>
            <EventGrid events={events}/>
        </>
    )
}

function findStartParam(){
    let parts = WebApp.initData.split('&');

    let eventId = null;
    parts.forEach(part => {
        let [key, value] = part.split('=');

        if (key === "start_param") {
            eventId = decodeURIComponent(value);
        }
    });

    return eventId;
}