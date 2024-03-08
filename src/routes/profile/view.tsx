import { useLoaderData } from "react-router-dom";
import {checkUser, getProfileEvents, saveUser, saveUserAvatar, uploadPinataFile, deletePinataFile} from "../../api/endpoints";
import EventGrid from "../../Components/EventGrid";
import {useLoader, useNotification} from "../root";
import {useTranslation} from "react-i18next";
import {useTonAddress} from "@tonconnect/ui-react";
import {Address} from "ton-core";
import {useEffect, useState} from "react";
import {useTonConnect} from "../../hooks/useTonConnect";
import { NavLink } from "react-router-dom";

const limit = 10;
const maxImageSize = 4500000;

export async function loader({ params }) {
    const address = params.address;
    let defaultEvents = [];
    let eventCount = 0;
    let defaultUser = {
        name: "",
        description: "",
        address: "",
        total_likes: 0,
        avatar: "/images/avatar_small.png"

    };
    let defaultHasNextPage = false;


    await getProfileEvents(address, {limit: limit}).then((response) => response.json())
        .then((data) => {
            defaultHasNextPage = data.hasNextPage ?? false;
            eventCount = data.eventCount ?? 0;
            defaultEvents = data.events ?? [];
        })
        .catch((error) => console.log(error));

    await checkUser(address).then((response) => response.json())
        .then((data) => {
            defaultUser = data;
        })
        .catch((error) => console.log(error));

    return { address, defaultEvents, eventCount, defaultUser, defaultHasNextPage };
}

export default function ProfileView(){
    const { address, defaultEvents, eventCount, defaultUser, defaultHasNextPage } = useLoaderData();

    const {setLoading} = useLoader();
    const [t] = useTranslation("global");
    const userFriendlyAddress = useTonAddress(false);
    const {connected} = useTonConnect();
    const [isOwner, setIsOwner] = useState(false);
    const [saving, setSaving] = useState(false);
    const [events, setEvents] = useState(defaultEvents);
    const {notifications, addNotification} = useNotification();
    const [usernameExist, setUsernameExist] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("/images/avatar_small.png");
    const [user, setUser] = useState(defaultUser);
    const [hasNextPage, setHasNextPage] = useState(defaultHasNextPage);
    const [page, setPage] = useState(1);

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
            const nextPage = page + 1;
            setLoadingEvents(true);
            await getProfileEvents(address, {limit: limit, page: nextPage}).then((response) => response.json())
                .then((data) => {
                    setHasNextPage(data.hasNextPage ?? false);
                    setEvents([...events, ...data.events ?? []]);
                    setPage(nextPage);
                })
                .catch((error) => console.log(error));
        };

        if (loadingEvents && hasNextPage) {
            fetchData();
        }
        setLoadingEvents(false);
    }, [loadingEvents]);

    const changeAvatar = async (e) => {

        const file = e.target.files[0];

        if(file.size >= maxImageSize){
            addNotification({
                success: false,
                message: t("notification.update_user_avatar_error")
            });

            return;
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

            return;
        }

        try {
            const image = await uploadPinataFile(file);
            const pinataImageUrl = `https://apricot-secret-orangutan-556.mypinata.cloud/ipfs/${image}`;

            await saveUserAvatar(address, pinataImageUrl).then((response) => response.json())
                .then(async (data) => {
                    if(user.avatar){
                        const hash = user.avatar.match(/ipfs\/([^/]+)/)[1];
                        await deletePinataFile(hash);
                    }

                    addNotification({
                        success: true,
                        message: t("notification.update_user")
                    });
                    setUser(data);
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
        if(connected){
            setIsOwner(Address.parse(userFriendlyAddress).toString() === address);
        }else{
            setIsOwner(false);
        }
        setLoading(false);
    }, [connected, address]);

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
                address: user.address,
                avatar: user.avatar,
            });
        } else if (regex.test(inputValue)) {
            setUser({
                name: inputValue,
                description: user.description,
                total_likes: user.total_likes,
                address: user.address,
                avatar: user.avatar,
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
            address: user.address,
            avatar: user.avatar,
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mb-5">{t("profile.title")}</h1>
            </div>

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
                {/*<div className="stat">*/}
                {/*    <div className="stat-title">{t("profile.total_likes")}</div>*/}
                {/*    <div className="stat-value text-secondary">228</div>*/}
                {/*</div>*/}
            </div>

            {events.length > 0 ? <>
                <div className="mb-5 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-neutral">{t("profile.your_events")}</h1>
                    <NavLink to="/event/create">
                        <div className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-accent" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <EventGrid events={events} />
            </> : <p className="text-lg text-primary font-semibold">{t("profile.empty_events")}</p>}
        </>
    );
}