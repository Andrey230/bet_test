import { useLoaderData } from "react-router-dom";
import {checkUser, getProfileEvents} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";
import {useLoader} from "../root";
import {useTranslation} from "react-i18next";
import {useTonAddress} from "@tonconnect/ui-react";
import {Address} from "ton-core";
import {useEffect, useState} from "react";
import {useTonConnect} from "../../hooks/useTonConnect";

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
    const userFriendlyAddress = useTonAddress(false);
    const {connected} = useTonConnect();
    const [isOwner, setIsOwner] = useState(false);
    const [user, setUser] = useState({
        name: "",
        description: "",
        address: "",
        total_likes: 0

    });

    useEffect(() => {
        checkUser(address).then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) => console.log(error));
        if(connected){
            setIsOwner(Address.parse(userFriendlyAddress).toString() === address);
        }else{
            setIsOwner(false);
        }
    }, [connected]);

    return (
        <>
            <h1 className="text-3xl font-semibold mb-5">{t("profile.title")}</h1>

            <div className="bg-base-100 rounded-xl p-5 mb-5 shadow-xl">
                <div className="flex justify-between items-center gap-4">
                    {isOwner ? <input type="text" placeholder="Your nickname" className="input bg-base-200 w-full" value={user.name}/>
                        : <p className="font-bold text-lg">{user.name}</p>}
                    <div className="avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://avatar.amuniversal.com/user_avatars/avatars_gocomicsver3/2885000/2885039/AvatarFinal.png" />
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    {isOwner ? <textarea className="textarea bg-base-200 w-full" placeholder={t("profile.description.placeholder")} value={user.description}></textarea>
                        : <p>{user.description}</p>}
                </div>
                {isOwner ? <button className="btn btn-primary mt-2">{t("profile.save.button")}</button> : ""}
            </div>

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

            <h1 className="text-3xl font-semibold mb-5">{t("profile.your_events")}</h1>
            {events.length > 0 ? <EventGrid events={events} /> : ""}
        </>
    );
}