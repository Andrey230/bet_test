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

const limitEvents = 10;

export async function loader({ params }) {
    let defaultEvents = [];
    let defaultHasNextPage = false;

    await getEvents({limit: limitEvents}).then((response) => response.json())
        .then((data) => {
            defaultEvents = data.events ?? [];
            defaultHasNextPage = data.hasNextPage ?? false;
        })
        .catch((error) => console.log(error));

    return { defaultEvents, defaultHasNextPage };
}

export default function Home(){
    const { defaultEvents, defaultHasNextPage } = useLoaderData();
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

    const [searchValue, setSearchValue] = useState('');
    const [events, setEvents] = useState(defaultEvents);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(defaultHasNextPage);
    const [t] = useTranslation("global");

    const debounce = (func, delay) => {
        let timerId;
        return function (...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const delayedSearch = useCallback(
        debounce(async (value) => {
            await searchEvents(value);
        }, 1000),
        []
    );

    const searchEvents = async (value) => {
        await getEvents({
            term: value
        }).then((response) => response.json())
            .then((data) => {
                setEvents(data.events ?? []);
            })
            .catch((error) => console.log(error));
    }

    const searchInputHandler = (element) => {
        const value = element.target.value;
        setSearchValue(value);
        delayedSearch(value);
    }

    const [loadingEvents, setLoadingEvents] = useState(false);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 20 &&
            !loadingEvents && hasNextPage
        ) {
            setLoadingEvents(true);
        }
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loadingEvents]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingEvents(true);
            await getEvents({page: page + 1, limit: limitEvents}).then((response) => response.json())
                .then((data) => {
                    setEvents([...events, ...data.events ?? []]);
                    setPage(page + 1);
                    setHasNextPage(data.hasNextPage ?? false);
                })
                .catch((error) => console.log(error));
        };

        if (loadingEvents && hasNextPage) {
            fetchData();
        }
        setLoadingEvents(false);
    }, [loadingEvents]);

    useEffect(() => {

        if(hasNextPage){
            const handleResize = () => {
                window.removeEventListener('scroll', handleScroll);
                window.addEventListener('scroll', handleScroll);
            };
            handleResize();
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [events]);

    return (
        <>
            <label className="input flex items-center gap-2 drop-shadow-xl w-full max-w-xs mb-5">
                <input type="text" id="find-event-input" placeholder={t("main.search.placeholder")} className="grow" value={searchValue} onChange={searchInputHandler}/>
                {searchValue !== "" ? <svg xmlns="http://www.w3.org/2000/svg" onClick={async () => {
                    setSearchValue("");
                    await searchEvents("");
                }} className="w-4 h-4 opacity-70" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg> : ""}
            </label>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-neutral">{t("main.categories.top")}</h1>
                {/*<div className="dropdown dropdown-bottom dropdown-end">*/}
                {/*    <div tabIndex={0} role="button" className="btn bg-base-100">{t("main.categories.label")}</div>*/}
                {/*    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 mt-3 rounded-box w-52">*/}
                {/*        <li><a>{t("main.categories.top")}</a></li>*/}
                {/*        <li><a>{t("main.categories.new")}</a></li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </div>
            <EventGrid events={events}/>
            <div className="flex justify-center mt-5 mb-5">
                {loadingEvents ? <span className="loading loading-dots loading-lg"></span> : ""}
            </div>
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