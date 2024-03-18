import {TonConnectButton, useTonConnectUI} from "@tonconnect/ui-react"
import { NavLink } from "react-router-dom"
import {useTonConnect} from "../hooks/useTonConnect"
import {Address} from "ton-core";
import { useTranslation } from 'react-i18next';
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import { useTonConnectModal } from '@tonconnect/ui-react';
import WebApp from "@twa-dev/sdk";

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

    const { open } = useTonConnectModal();

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
                        {/*<NavLink to="/" className="btn btn-ghost btn-circle avatar" onClick={handleClick}>*/}
                        {/*    <div>*/}
                        {/*        <svg xmlns="http://www.w3.org/2000/svg"  className="inline-block w-5 h-5 fill-primary" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>*/}
                        {/*    </div>*/}
                        {/*</NavLink>*/}
                    </div>
                </div>

                <div className="flex-none">
                    <NavLink to="/about-us" className="btn btn-ghost btn-circle avatar" onClick={handleClick}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 fill-accent" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        </div>
                    </NavLink>
                    <div className="dropdown dropdown-bottom">
                        <div tabIndex={0} role="button" className="w-10 h-12 flex justify-center items-center">
                            <span className="font-bold text-secondary">{i18n.language}</span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                            <li><a onClick={() => changeLanguage("en")}>en</a></li>
                            {/*<li><a onClick={() => changeLanguage("ua")}>ua</a></li>*/}
                            {/*<li><a onClick={() => changeLanguage("pl")}>pl</a></li>*/}
                            <li><a onClick={() => changeLanguage("ru")}>ru</a></li>
                            <li><a onClick={() => changeLanguage("es")}>es</a></li>
                        </ul>
                    </div>
                    {connected ? (
                        <>
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

                        <button className="btn btn-ghost btn-circle" onClick={() => open()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 fill-primary" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}