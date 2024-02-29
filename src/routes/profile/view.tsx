import { useLoaderData } from "react-router-dom";
import {checkUser, getProfileEvents, saveUser, saveUserAvatar} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";
import {useLoader, useNotification} from "../root";
import {useTranslation} from "react-i18next";
import {useTonAddress} from "@tonconnect/ui-react";
import {Address} from "ton-core";
import {useEffect, useState} from "react";
import {useTonConnect} from "../../hooks/useTonConnect";
import { put } from "@vercel/blob";
const blobToken = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

export async function loader({ params }) {
    const address = params.address;

    return { address };
}

export default function ProfileView(){
    const { address } = useLoaderData();

    const [eventCount, setEventCount] = useState(0);
    const [events, setEvents] = useState([]);

    const {loading, setLoading} = useLoader();
    const [t] = useTranslation("global");
    const userFriendlyAddress = useTonAddress(false);
    const {connected} = useTonConnect();
    const [isOwner, setIsOwner] = useState(false);
    const [saving, setSaving] = useState(false);
    const {notifications, addNotification} = useNotification();
    const [usernameExist, setUsernameExist] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("/images/avatar_small.png");
    const [user, setUser] = useState({
        name: "",
        description: "",
        address: "",
        total_likes: 0,
        avatar: "/images/avatar_small.png"

    });
    const maxImageSize = 4500000;

    const changeAvatar = async (e) => {

        const file = e.target.files[0];

        if(file.size >= maxImageSize){
            addNotification({
                success: false,
                message: t("notification.update_user_avatar_error")
            });
        }else{
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }

        let format = null;
        switch (file.type){
            case "image/png":
                format = 'png';
                break;
            case "image/jpeg":
                format = 'jpg';
                break;
        }

        if(!format){
            addNotification({
                success: false,
                message: t("notification.update_user_avatar_error")
            });
        }

        const filename = `avatars/avatar.${format}`;

        try {
            const {url} = await put(filename, file, {
                access: 'public',
                token: blobToken,
            });

            await saveUserAvatar(address, url).then((response) => response.json())
                .then((data) => {
                    addNotification({
                        success: true,
                        message: t("notification.update_user_avatar_success")
                    });
                })
                .catch((error) => {
                    addNotification({
                        success: false,
                        message: t("notification.update_user_avatar_error")
                    });
                });

        }catch (error){
            addNotification({
                success: false,
                message: t("notification.update_user_avatar_error")
            });
        }
    }

    useEffect(() => {
        getProfileEvents(address).then((response) => response.json())
            .then((data) => {
                setEventCount(data.eventCount ?? 0);
                setEvents(data.events);
            })
            .catch((error) => console.log(error));

        checkUser(address).then((response) => response.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error) => console.log(error));
        if(connected){
            setIsOwner(Address.parse(userFriendlyAddress).toString() === address);
        }else{
            setIsOwner(false);
        }

    }, [loading, connected, address]);

    const changeName = (event) => {
        let inputValue = event.target.value.toLowerCase();
        const regex = /^[a-z\d_]+$/;

        if(inputValue.length > 25){
            return;
        }

        setUsernameExist(false);

        if (inputValue === '') {
            setUser({
                name: '',
                description: user.description,
                total_likes: user.total_likes,
                address: user.address
            });
        } else if (regex.test(inputValue)) {
            setUser({
                name: inputValue,
                description: user.description,
                total_likes: user.total_likes,
                address: user.address
            });
        }
    }

    const changeDescription = (event) => {
        let inputValue = event.target.value;

        if(inputValue.length > 100){
            return;
        }

        setUser({
            name: user.name,
            description: inputValue,
            total_likes: user.total_likes,
            address: user.address
        });
    }

    const saveUserHandler = async () => {
        if(saving){
            return;
        }

        saveUser(address, user).then((response) => response.json())
            .then((data) => {
                if(data.status){
                    addNotification({
                        success: true,
                        message: t("notification.update_user")
                    });
                }else{
                    if(data.error === 'username.exist'){
                        setUsernameExist(true);
                    }
                }
                setSaving(false);
            })
            .catch((error) => {
                addNotification({
                    success: false,
                    message: t("notification.error")
                });
                setSaving(false);
            });

        setSaving(true);
    }

    return (
        <>
            <h1 className="text-3xl font-semibold mb-5">{t("profile.title")}</h1>

            <div className="bg-base-100 rounded-xl p-5 mb-5 shadow-xl">
                <div className="flex justify-between items-center gap-4">
                    {isOwner ?
                        <div>
                            <input type="text" placeholder={t("profile.name.placeholder")}
                                   className={`input bg-primary/10 text-neutral font-semibold w-full ${user.name === "" || usernameExist ? "input-bordered input-error" : ""}`} value={user.name}
                                   onChange={changeName}
                            />
                        </div>
                        : <p className="font-bold text-lg text-neutral">{user.name}</p>}
                    {isOwner ? <label>
                        <div className="avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user.avatar ?? '/images/avatar_small.png'} />
                            </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={changeAvatar}/>
                    </label>: <div className="avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user.avatar ?? '/images/avatar_small.png'} />
                        </div>
                    </div>}
                </div>
                {isOwner ? <p className={`text-xs font-semibold text-info/80 ${usernameExist ? "text-error" : "text-base-content/30"}`}>{usernameExist ? t("profile.name.existed") : t("profile.name.allowed_characters")}</p> : ""}
                <div className="mt-5">
                    {isOwner ? <textarea className="textarea bg-primary/10 text-neutral font-semibold w-full" placeholder={t("profile.description.placeholder")} value={user.description} onChange={changeDescription}></textarea>
                        : <p className="font-semibold text-neutral">{user.description}</p>}
                </div>
                {isOwner ? <button className="btn btn-primary mt-2" onClick={saveUserHandler}>{saving ? <span className="loading loading-spinner loading-md"></span> : t("profile.save.button")}</button> : ""}
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

            {events.length > 0 ? <>
                <h1 className="text-3xl font-semibold mb-5 text-neutral">{t("profile.your_events")}</h1>
                <EventGrid events={events} />
            </> : <p className="text-lg text-primary font-semibold">{t("profile.empty_events")}</p>}
        </>
    );
}