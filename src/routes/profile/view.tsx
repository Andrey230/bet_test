import { useLoaderData } from "react-router-dom";
import {getProfileEvents} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";
import {useLoader} from "../root";
import {useTranslation} from "react-i18next";

export async function loader({ params }) {
    const address = params.address;
    let events = [];
    let eventCount = 0;


    await getProfileEvents(address).then((response) => response.json())
        .then((data) => {
            eventCount = data.eventCount ?? 0;
            events = data.events ?? [];
        })
        .catch((error) => console.log(error));

    return { address, events, eventCount };
}

export default function ProfileView(){
    const { address, events, eventCount } = useLoaderData();
    const {setLoading} = useLoader();
    setLoading(false);
    const [t] = useTranslation("global");

    return (
        <>
            <h1 className="text-3xl font-semibold mb-5">{t("profile.your_events")}</h1>
            <div className="stats mb-5 shadow-xl w-full">
                <div className="stat">
                    <div className="stat-title">{t("profile.total_events")}</div>
                    <div className="stat-value text-primary">{eventCount}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">{t("profile.total_likes")}</div>
                    <div className="stat-value text-secondary">228</div>
                </div>
            </div>
            <EventGrid events={events} />
        </>
    );
}