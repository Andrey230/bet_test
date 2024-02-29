import {TonConnectButton, useTonConnectUI} from "@tonconnect/ui-react"
import { NavLink } from "react-router-dom"
import {useTonConnect} from "../hooks/useTonConnect"
import {Address} from "ton-core";
import { useTranslation } from 'react-i18next';
import {useCookies} from "react-cookie";
import {useEffect} from "react";

export default function Header() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const {connected, wallet} = useTonConnect();
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [t, i18n] = useTranslation("global");

    useEffect(() => {
        if(localStorage.getItem('ton-connect-storage_bridge-connection') && !connected){
            tonConnectUI.disconnect();
        }
    }, []);

    useEffect(() => {
        if(["ru", "en"].includes(i18n.language)){
            setOptions({
                language: i18n.language
            });
        }
    }, [i18n.language]);

    const disconnectWallet = async () => {
        await tonConnectUI.disconnect()
    }

    const handleClick = () => {
        const elem = document.activeElement;
        if(elem){
            elem?.blur();
        }
    };

    const changeLanguage = (lang => {
        i18n.changeLanguage(lang);
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 2);

        setCookie("language",lang, {
            expires: currentDate
        });

        const elem = document.activeElement;
        if(elem){
            elem?.blur();
        }
    });

    return (
        <>
            <div className="navbar bg-base-100 relative z-20 shadow-lg">
                <div className="flex-1">
                    <div className="flex items-center">
                        <NavLink to="/" className="btn btn-ghost">
                            {/*<p className="text-lg font-bold">Agora</p>*/}
                            <img src="/images/logo_empty.png" className="w-12 rounded-full" />
                            {/*<div>*/}
                            {/*    <svg xmlns="http://www.w3.org/2000/svg"  className="inline-block w-5 h-5 stroke-current" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>*/}
                            {/*</div>*/}
                        </NavLink>
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="w-10 h-12 flex justify-center items-center">
                                <span className="font-bold text-secondary">{i18n.language}</span>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                                <li><a onClick={() => changeLanguage("en")}>en</a></li>
                                <li><a onClick={() => changeLanguage("ua")}>ua</a></li>
                                <li><a onClick={() => changeLanguage("pl")}>pl</a></li>
                                <li><a onClick={() => changeLanguage("ru")}>ru</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex-none">
                    {connected ? (
                        <>
                            <NavLink to="/" className="btn btn-ghost btn-circle avatar" onClick={handleClick}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg"  className="inline-block w-5 h-5 fill-primary" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
                                </div>
                            </NavLink>
                            <NavLink to="/event/create">
                                <div className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-accent" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                    </div>
                                </div>
                            </NavLink>


                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    {/*<div className="w-10 rounded-full">*/}
                                    {/*    <img alt="Tailwind CSS Navbar component" src="https://i.pinimg.com/564x/20/9d/05/209d0505bae0f88be624f8aa9a6d4f4b.jpg" />*/}
                                    {/*</div>*/}
                                    <button className="">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                    </button>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <NavLink to={`profile/${Address.parse(wallet?.toString())}`} className="justify-between" onClick={handleClick}>
                                            {t("header.menu.profile")}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="tickets" className="justify-between" onClick={handleClick}>
                                            {t("header.menu.tickets")}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="profile/history" className="justify-between" onClick={handleClick}>
                                            {t("header.menu.history")}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/about-us" className="justify-between" onClick={handleClick}>
                                            {t("header.menu.about-us")}
                                        </NavLink>
                                    </li>
                                    <li><a onClick={disconnectWallet}>{t("header.menu.logout")}</a></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <TonConnectButton className="ton-connect-button"/>
                    )}
                </div>
            </div>
        </>
    )
}