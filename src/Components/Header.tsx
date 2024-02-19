import {TonConnectButton, useTonConnectUI} from "@tonconnect/ui-react"
import { NavLink } from "react-router-dom"
import {useTonConnect} from "../hooks/useTonConnect"
import {Address} from "ton-core";
import { useTranslation } from 'react-i18next';
import {useCookies} from "react-cookie";

export default function Header() {

    const [cookies, setCookie, removeCookie] = useCookies();
    const {connected, wallet} = useTonConnect();
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [t, i18n] = useTranslation("global");

    setOptions({
        language: i18n.language
    });

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
            <div className="navbar bg-base-100 relative z-20 shadow">
                <div className="flex-1">
                    <div className="flex items-center">
                        <NavLink to="/" className="btn btn-ghost text-xl">moc1000</NavLink>
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="w-10 h-12 flex justify-center items-center">
                                <span className="font-bold text-primary">{i18n.language}</span>
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
                            <NavLink to="/event/create">
                                <div className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" stroke="currentColor" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                    </div>
                                </div>
                            </NavLink>


                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img alt="Tailwind CSS Navbar component" src="https://i.pinimg.com/564x/20/9d/05/209d0505bae0f88be624f8aa9a6d4f4b.jpg" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <NavLink to={`profile/${Address.parse(wallet?.toString())}`} className="justify-between" onClick={handleClick}>
                                            {t("header.menu.events")}
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
                                    <li><a onClick={disconnectWallet}>{t("header.menu.logout")}</a></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <TonConnectButton />
                    )}
                </div>
            </div>
        </>
    )
}